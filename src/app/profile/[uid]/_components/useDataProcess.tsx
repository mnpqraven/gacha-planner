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

/**
 * This hook will perform the following tasks
 * - get the current character and light cone's stat at the current levels
 * - normalize sum data across the board for radar chart
 * */
function useDataProcess() {
  // INFO: calc order + formula
  // base char stat + lc:
  // trace
  // main stat's impact from relic on stats (flat + %)
  // sub stat's impact from relic on stats (flat + %)
  // normalize summed data
  const { promotion: lcPromo } = useLightConePromotion(undefined);
  const { promotion: charPromo } = useCharacterPromotion(undefined);

  function sumFromRelic() {}

  function normalize() {}
}

interface AfterPromotion<T> {
  promotionConfig: T;
  level: number;
  ascension: number;
}

// TODO: cross check promotion data
// pela @68 = 472 atk
function charAfterPromotion({
  promotionConfig,
  level,
  ascension,
}: AfterPromotion<AvatarPromotionConfig>) {
  const atk_bases = promotionConfig.attack_base.slice(0, ascension - 1);
  const atk_sum =
    atk_bases.reduce((a, b) => a + b, 0) +
    (level - 1) * promotionConfig.attack_add[0];

  const def_bases = promotionConfig.defence_base.slice(0, ascension - 1);
  const def_sum =
    def_bases.reduce((a, b) => a + b, 0) +
    (level - 1) * promotionConfig.defence_add[0];

  const hp_bases = promotionConfig.hpbase.slice(0, ascension - 1);
  const hp_sum =
    hp_bases.reduce((a, b) => a + b, 0) +
    (level - 1) * promotionConfig.hpadd[0];
  return { atk: atk_sum, def: def_sum, hp: hp_sum };
}

// TODO: cross check promotion data
// kafka lc @80 = 582 atk
function lcAfterPromotion({
  promotionConfig,
  level,
  ascension,
}: AfterPromotion<EquipmentPromotionConfig>) {
  const atk_bases = promotionConfig.base_attack.slice(0, ascension - 1);
  const atk_sum =
    atk_bases.reduce((a, b) => a + b, 0) +
    (level - 1) * promotionConfig.base_attack_add[0];

  const def_bases = promotionConfig.base_defence.slice(0, ascension - 1);
  const def_sum =
    def_bases.reduce((a, b) => a + b, 0) +
    (level - 1) * promotionConfig.base_defence_add[0];

  const hp_bases = promotionConfig.base_hp.slice(0, ascension - 1);
  const hp_sum =
    hp_bases.reduce((a, b) => a + b, 0) +
    (level - 1) * promotionConfig.base_hpadd[0];
  return { atk: atk_sum, def: def_sum, hp: hp_sum };
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

// NOTE: this is considered as blue value, use this to divide by base (grey
// value) to get direct normalized values for chart
function mhmSumValue(chara: MihomoCharacter, field: Field) {
  const { additions, attributes } = chara;

  // TODO: integrate with above accumulator,
  // access by key, filter argument arrays by values
  // internal calc properties = blue values
  // element_dmg = ele += AllDamageTypeAddedRatio
  //
  // if (attribute)
  // return addition / attribute
  // else return addition
}

function propertyAccessor(
  attr: MihomoAttributeConfig,
  greyValue: { atk: number; def: number; hp: number }
) {
  switch (attr.field as Field) {
    // case "hp"
    // case 'atk'
    // case 'def'
    // return getBlue() / getGrey()
    // default
    // return ownAccessor
    case "hp":
      return attr.value / greyValue.hp;
    case "atk":
      return attr.value / greyValue.atk;
    case "def":
      return attr.value / greyValue.def;
    case "spd":
    case "crit_rate":
    case "crit_dmg":
    case "break_dmg":
    case "heal_rate":
    case "sp_rate":
    case "effect_hit":
    case "effect_res":
    case "lightning_dmg":
    case "wind_dmg":
    case "fire_dmg":
    case "quantum_dmg":
    case "imaginary_dmg":
    case "ice_dmg":
    case "physical_dmg":
      return attr.value;
  }
}

function getBounds(field: Field) {
  switch (field) {
    case "hp":
    case "atk":
      return 2; // TODO: extra match
    case "def":
      return 3; // TODO: extra math
    case "crit_dmg":
    case "break_dmg":
      return 2.0;
    case "effect_hit":
    case "effect_res":
    case "crit_rate":
    case "heal_rate":
      return 0.5;
    case "sp_rate":
      return 0.2;
    case "spd":
      return 161;
    // element dmg
    default:
      return 1.0;
  }
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
