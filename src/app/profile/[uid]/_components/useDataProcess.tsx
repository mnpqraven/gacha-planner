import { AvatarPromotionConfig } from "@/bindings/AvatarPromotionConfig";
import { EquipmentPromotionConfig } from "@/bindings/EquipmentPromotionConfig";
import { useCharacterPromotion } from "@/hooks/queries/useCharacterPromotion";
import { useLightConePromotion } from "@/hooks/queries/useLightConePromotion";
import {
  MihomoAttributeConfig,
  MihomoCharacter,
  MihomoPlayer,
  MihomoSkillTreeConfig,
} from "../../types";
import { Property, SkillTreeConfig } from "@/bindings/SkillTreeConfig";
import { getNodeType } from "@/app/components/Character/TraceTable";
import { Field } from "./SpiderChartWrapper";
import { Element, Path } from "@/bindings/PatchBanner";

const accumulator: { [k in Field]: Field[] } = {
  hp: ["hp"],
  atk: ["atk"],
  def: ["def"],
  effect_hit: ["effect_hit"],
  effect_res: ["effect_res"],
  all_dmg: ["all_dmg"],
  spd: ["spd"],
  crit_rate: ["crit_rate"],
  crit_dmg: ["crit_dmg"],
  break_dmg: ["break_dmg"],
  sp_rate: ["sp_rate"],
  heal_rate: ["heal_rate"],
  fire_dmg: ["fire_dmg", "all_dmg"],
  physical_dmg: ["physical_dmg", "all_dmg"],
  wind_dmg: ["wind_dmg", "all_dmg"],
  lightning_dmg: ["lightning_dmg", "all_dmg"],
  imaginary_dmg: ["imaginary_dmg", "all_dmg"],
  quantum_dmg: ["quantum_dmg", "all_dmg"],
  ice_dmg: ["ice_dmg", "all_dmg"],
};

interface HookReturn {
  data: { field: Field; value: number }[];
}
interface Props {
  character: MihomoCharacter | undefined;
  // options: {}
}
/**
 * This hook will perform the following tasks
 * - get the current character and light cone's stat at the current levels
 * - normalize sum data across the board for radar chart
 * */
export function useDataProcess({ character }: Props): HookReturn {
  // INFO: calc order + formula
  // base char stat + lc:
  // trace
  // main stat's impact from relic on stats (flat + %)
  // sub stat's impact from relic on stats (flat + %)
  // normalize summed data
  const { promotion: charPromo } = useCharacterPromotion(character?.id);
  const { promotion: lcPromo } = useLightConePromotion(
    Number(character?.light_cone.id)
  );

  if (!!charPromo && !!character && !!lcPromo) {
    const currentGreyChar = charAfterPromotion({
      promotionConfig: charPromo,
      ascension: character.promotion,
      level: character.level,
    });
    const currentGreyLc = lcAfterPromotion({
      promotionConfig: lcPromo,
      ascension: character.light_cone.promotion,
      level: character.light_cone.level,
    });
    const maxedGreyChar = charAfterPromotion({ promotionConfig: charPromo });
    const maxedGreyLc = lcAfterPromotion({ promotionConfig: lcPromo });

    const { additions, attributes } = character;
    let data: { field: Field; value: number }[] = [];
    Object.entries(accumulator).forEach((entry) => {
      const [key, list] = entry as [Field, Field[]];
      const addition = additions.filter((e) => list.includes(e.field));
      const attribute = attributes.filter((e) => list.includes(e.field));

      // grey value
      const attributeSum = attribute.reduce((a, b) => a + b.value, 0);
      // blue value
      const additionSum = addition.reduce((a, b) => a + b.value, 0);

      // final ratio = (grey value + blue value) / grey value @ lv80

      // console.log('key: ', key, 'addition: ', addition, 'attribute: ', attribute)
      const normalizedValue = normalizeKeyValue(
        key,
        additionSum,
        attributeSum,
        {
          currentGreyChar,
          currentGreyLc,
          maxedGreyChar,
          maxedGreyLc,
        }
      );

      data.push({
        field: key,
        // 2nd argument (attributeSum) is spd value for spd case
        value: normalizedValue / getNormalizedBound(key, attributeSum),
      });
    });

    return {
      data: data
        .sort(
          (fieldA, fieldB) =>
            getSortValue(fieldA.field) - getSortValue(fieldB.field)
        )
        .filter(filterFieldsByRole(character.element.name))
        .filter(filterEmptyValues()),
    };
  }

  function normalizeKeyValue<
    T extends { atk: number; def: number; hp: number }
  >(
    key: Field,
    additionSum: number,
    attributeSum: number,
    {
      currentGreyChar,
      currentGreyLc,
      maxedGreyChar,
      maxedGreyLc,
    }: {
      currentGreyChar: T;
      currentGreyLc: T;
      maxedGreyChar: T;
      maxedGreyLc: T;
    }
  ): number {
    switch (key) {
      case "hp":
        const maxedHp = maxedGreyChar.hp + maxedGreyLc.hp;
        const currentGreyHp = currentGreyChar.hp + currentGreyLc.hp;
        return (additionSum + currentGreyHp) / maxedHp;
      case "atk":
        const maxedAtk = maxedGreyChar.atk + maxedGreyLc.atk;
        const currentGreyAtk = currentGreyChar.atk + currentGreyLc.atk;
        return (additionSum + currentGreyAtk) / maxedAtk;
      case "def":
        const maxedDef = maxedGreyChar.def + maxedGreyLc.def;
        const currentGreyDef = currentGreyChar.def + currentGreyLc.def;
        return (additionSum + currentGreyDef) / maxedDef;
      case "spd":
        return additionSum;
      case "crit_rate":
      case "crit_dmg":
      case "break_dmg":
      case "heal_rate":
      case "sp_rate":
      case "effect_hit":
      case "effect_res":
      case "all_dmg":

      case "lightning_dmg":
      case "wind_dmg":
      case "fire_dmg":
      case "quantum_dmg":
      case "imaginary_dmg":
      case "ice_dmg":
      case "physical_dmg":
        return additionSum + attributeSum;
    }
  }

  return { data: [] };
}

interface AfterPromotion<T> {
  promotionConfig: T;
  level?: number;
  ascension?: number;
}

function charAfterPromotion({
  promotionConfig,
  level = 80,
  ascension = 6,
}: AfterPromotion<AvatarPromotionConfig>) {
  const atk_base = promotionConfig.attack_base[ascension];
  const atk_sum =
    atk_base + (level - 1) * promotionConfig.attack_add[ascension];

  const def_base = promotionConfig.defence_base[ascension];
  const def_sum =
    def_base + (level - 1) * promotionConfig.defence_add[ascension];

  const hp_base = promotionConfig.hpbase[ascension];
  const hp_sum = hp_base + (level - 1) * promotionConfig.hpadd[ascension];

  return { atk: atk_sum, def: def_sum, hp: hp_sum };
}

function lcAfterPromotion({
  promotionConfig,
  level = 80,
  ascension = 6,
}: AfterPromotion<EquipmentPromotionConfig>) {
  const atk_base = promotionConfig.base_attack[ascension];
  const atk_sum =
    atk_base + (level - 1) * promotionConfig.base_attack_add[ascension];

  const def_base = promotionConfig.base_defence[ascension];
  const def_sum =
    def_base + (level - 1) * promotionConfig.base_defence_add[ascension];

  const hp_base = promotionConfig.base_hp[ascension];
  const hp_sum = hp_base + (level - 1) * promotionConfig.base_hpadd[ascension];

  return { atk: atk_sum, def: def_sum, hp: hp_sum };
}

function getNormalizedBound(field: Field, charSpd: number) {
  switch (field) {
    case "hp":
    case "atk":
      return 3;
    case "def":
      return 4;
    case "crit_dmg":
    case "break_dmg":
      return 2.0;
    case "effect_hit":
    case "effect_res":
    case "crit_rate":
    case "heal_rate":
      return 1.0;
    case "sp_rate":
      return 0.5;
    case "spd":
      return 161 - charSpd;
    // element dmg
    default:
      return 1.0;
  }
}

function filterFieldsByRole<T extends { field: Field }>(
  element: Element
): (data: T) => boolean {
  const defaultFields: Field[] = [
    "hp",
    "atk",
    "def",
    "crit_dmg",
    "crit_rate",
    "effect_hit",
    "effect_res",
    "heal_rate",
    "sp_rate",
    "spd",
  ];
  let eleField: Field | undefined = undefined;
  switch (element) {
    case "Fire":
      eleField = "fire_dmg";
      break;
    case "Ice":
      eleField = "ice_dmg";
      break;
    case "Physical":
      eleField = "physical_dmg";
      break;
    case "Wind":
      eleField = "wind_dmg";
      break;
    case "Lightning":
      eleField = "lightning_dmg";
      break;
    case "Quantum":
      eleField = "quantum_dmg";
      break;
    case "Imaginary":
      eleField = "imaginary_dmg";
      break;
  }
  return (data) => [...defaultFields, eleField].includes(data.field);
}

function filterEmptyValues<T extends { value: number }>() {
  return (data: T) => data.value >= 0.01;
}

function getSortValue(field: Field): number {
  switch (field) {
    case "atk":
      return 0;
    case "spd":
      return 1;
    case "crit_rate":
      return 2;
    case "crit_dmg":
      return 3;
    case "break_dmg":
      return 4;
    case "lightning_dmg":
      return 5;
    case "wind_dmg":
      return 6;
    case "fire_dmg":
      return 7;
    case "quantum_dmg":
      return 8;
    case "imaginary_dmg":
      return 9;
    case "ice_dmg":
      return 10;
    case "physical_dmg":
      return 11;
    case "all_dmg":
      return 12;
    case "sp_rate":
      return 13;
    case "effect_hit":
      return 14;
    case "effect_res":
      return 15;
    case "heal_rate":
      return 16;
    case "def":
      return 17;
    case "hp":
      return 18;
  }
}

/**
 * upsert algorithm of trace to compute into a single object with total sum
 * of each property present
 * @param skillTree - [TODO:description]
 * @param dbSkillTree - [TODO:description]
 * @returns [TODO:return]
 */
function sumAfterTrace(
  skillTree: MihomoSkillTreeConfig[],
  dbSkillTree: SkillTreeConfig[]
) {
  // filter to only stat nodes
  const statNodes = dbSkillTree.filter((e) => getNodeType(e) === "SMALL");
  // level 0 = locked, level 1 = unlocked
  let nodeMap: Partial<Record<Property, number>> = {};

  // TODO: test upsert algo
  statNodes.forEach(({ point_id, status_add_list }) => {
    const find = skillTree.find((e) => Number(e.id) == point_id);
    if (find && find.level > 0) {
      const property = status_add_list[0].property_type;
      const value = status_add_list[0].value.value;
      if (nodeMap[property] === undefined) nodeMap[property] = value;
      else nodeMap[property]! += value;
    }
  });
  return nodeMap;
}

function getGreyValue(
  promotionChar: AvatarPromotionConfig,
  promotionLc: EquipmentPromotionConfig,
  level: number,
  ascension: number
): { atk: number; def: number; hp: number } {
  const char = charAfterPromotion({
    promotionConfig: promotionChar,
    level,
    ascension,
  });
  const lc = lcAfterPromotion({
    promotionConfig: promotionLc,
    level,
    ascension,
  });
  return {
    atk: char.atk + lc.atk,
    def: char.def + lc.def,
    hp: char.hp + lc.hp,
  };
}

function mhmGreyValue(char: MihomoCharacter) {
  return char.properties;
}

function mhmBlueValue(chara: MihomoCharacter) {
  // for now use mihomo's additions
  return chara.additions;
}

// const finalized =  propertyAccessor() / getBounds()

// NOTE: pela
// lv 68
// 1 atk trace (4%)
// base atk: 472 + 18 (atk trace 4%) => base * atk%
//
// NOTE: kafka lc lv 80
// base atk: 472 + 582 = 1054 + 4% (trace) = 42
//
//
// INFO: => (base char + base lc) = grey
// [grey * (trace% * relic%)] + relic flat = blue
// sum = grey + blue
//
// INFO: bounds
// separate into 4 categories for normalization:
//
// INFO: 1. fastest: property that appers in both main + subs with relatively
// high rate (5.83% for cdmg/break)
// cdmg + break (TOEVAL: DEF)
// => bounds: (sum) 0 > 200%
//
// INFO: 2. norm flat: same as 1 but with lower rate
// eres + ehr + c_rate + element_dmg
// => bounds: (sum) 0 > 100%
//
// INFO: 3. norm flat: stats that contains both flat and %sub, mergin with
// base stat
// hp + atk + def
// TODO: bounds:
// hp atk: (blue / grey) -> 200%
// def: (blue / grey) 300%
//
// INFO: 4. slow: not present as sub
// heal_rate + sp_rate
// => bounds:
// heal_rate: (sum) 50%,
// sp_rate: (sum) 50%
//
// INFO: 5. spd flat
// => bounds: 161
