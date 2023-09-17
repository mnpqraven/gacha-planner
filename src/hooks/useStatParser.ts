import { AvatarPromotionConfig } from "@/bindings/AvatarPromotionConfig";
import { useCharacterPromotion } from "./queries/useCharacterPromotion";
import { useCharacterTrace } from "./queries/useCharacterTrace";
import { useLightConePromotion } from "./queries/useLightConePromotion";
import { EquipmentPromotionConfig } from "@/bindings/EquipmentPromotionConfig";
import { Property } from "@/bindings/RelicSubAffixConfig";
import { useRelicSetBonuses } from "./queries/useRelicSetBonus";
import { useLightConeSkill } from "./queries/useLightConeSkill";
import {
  charAfterPromotion,
  lcAfterPromotion,
} from "@/app/profile/[uid]/_components/useDataProcess";
import { RelicCategory } from "@/app/profile/armory/schema";

type BasicMetadata = { id: number; level: number; ascension: number };
export type ParsedRelicSchema = {
  id: number;
  rarity: number;
  setId: number;
  // INFO: not yet needed
  type: RelicCategory;
  level: number;
  mainStat: {
    property: Property;
    value: number;
  };
  subStat: { property: Property; count: number; value: number }[];
};

export type BaseValueSchema = {
  atk: number;
  hp: number;
  def: number;
  speed: number;
  critical_chance: number;
  critical_damage: number;
};

export interface ParsedStatRecord {
  baseValues: BaseValueSchema;
  propertyList: Partial<Record<Property, number>>;
  statTable: Partial<Record<Property, number>>;
  normalized: Pick<BaseValueSchema, "hp" | "atk" | "def">;
}

export interface StatParserConstructor {
  character: BasicMetadata;
  traceTable: Record<string | number, boolean>;
  lightCone: (BasicMetadata & { imposition: number }) | null;
  relic: ParsedRelicSchema[];
}

export function useStatParser(props?: StatParserConstructor) {
  const { data: traceData } = useCharacterTrace(props?.character.id);
  const { data: charPromotionData } = useCharacterPromotion(
    props?.character.id
  );
  const { data: lcPromotionData } = useLightConePromotion(props?.lightCone?.id);
  const { data: lcSkillData } = useLightConeSkill(props?.lightCone?.id);
  const { data: relicBonuses } = useRelicSetBonuses();

  if (!traceData || !charPromotionData || !props || !relicBonuses) {
    console.log(
      "should not see this null",
      traceData,
      charPromotionData,
      props,
      relicBonuses
    );
    return undefined;
  }

  const { ascension: charAscension, level: charLevel } = props.character;
  const { ascension: lcAscension, level: lcLevel } = props.lightCone ?? {
    ascension: 0,
    level: 0,
  };

  const baseCharValues = baseChar(charLevel, charAscension, charPromotionData);
  const baseLcValues = baseLc(lcLevel, lcAscension, lcPromotionData);

  const baseValues: BaseValueSchema = {
    atk: baseCharValues.atk + baseLcValues.atk,
    hp: baseCharValues.hp + baseLcValues.hp,
    def: baseCharValues.def + baseLcValues.def,
    speed: charPromotionData.speed_base,
    critical_chance: charPromotionData.critical_chance,
    critical_damage: charPromotionData.critical_damage,
  };

  // INFO: PERCENT FROM LC
  let lcTotal: Partial<Record<Property, number>> = {};
  const lcProps = lcSkillData?.ability_property.at(
    props.lightCone?.imposition ?? 0
  );
  if (!!lcProps) {
    lcProps.forEach(({ property_type, value }) => {
      if (!lcTotal[property_type]) lcTotal[property_type] = value.value;
      else lcTotal[property_type]! += value.value;
    });
  }

  // INFO: PERCENT FROM TRACES
  const tracePropList = traceData
    .filter((trace) =>
      Object.keys(props.traceTable).includes(String(trace.point_id))
    )
    .filter((trace) => !!trace.status_add_list.length)
    .map((trace) => ({
      property: trace.status_add_list[0].property_type,
      value: trace.status_add_list[0].value.value,
    }));

  let traceTotal: Partial<Record<Property, number>> = {};

  tracePropList.forEach(({ property, value }) => {
    if (!traceTotal[property]) traceTotal[property] = value;
    else traceTotal[property]! += value;
  });

  // INFO: PERCENT FROM RELIC SET BONUSES
  // Record<setId, num>
  let setTracker: Record<string, number> = {};
  props.relic.forEach(({ setId }) => {
    if (!setTracker[setId]) setTracker[setId] = 1;
    else setTracker[setId] += 1;
  });
  // Record<Property, number>
  let setBonusTotal: Partial<Record<Property, number>> = {};
  Object.entries(setTracker).forEach(([setId, possessingCount]) => {
    const find = relicBonuses.find((e) => e.set_id == Number(setId));
    if (!find) return;

    find.property_list.forEach((props, index) => {
      // not reaching pc req. for bonus activation
      if (find.require_num[index] > possessingCount) return;
      props.forEach(({ property, value }) => {
        if (!setBonusTotal[property]) setBonusTotal[property] = value;
        else setBonusTotal[property]! += value;
      });
    });
  });

  // INFO: PERCENT FROM RELIC
  // this ignore substat step so we can map it out
  const subStatNoStep = (relic: ParsedRelicSchema) =>
    relic.subStat.map(({ property, value }) => ({ property, value }));

  const relicPropList = props.relic.map((relic) => [
    relic.mainStat,
    ...subStatNoStep(relic),
  ]);

  let relicTotal: Partial<Record<Property, number>> = {};

  relicPropList.forEach((props) => {
    props.forEach(({ property, value }) => {
      if (!relicTotal[property]) relicTotal[property] = value;
      else relicTotal[property]! += value;
    });
  });

  const summed = sumProps([traceTotal, relicTotal, setBonusTotal, lcTotal]);

  // TODO: parse relic data then multiply base with trace altogether

  const {
    atk: maxChAtk,
    def: maxChDef,
    hp: maxChHp,
  } = charAfterPromotion({
    promotionConfig: charPromotionData,
  });
  const {
    atk: maxLcAtk,
    def: maxLcDef,
    hp: maxLcHp,
  } = lcAfterPromotion({ promotionConfig: lcPromotionData });
  const normalized = {
    atk:
      (baseValues.atk +
        orZero(summed["AttackDelta"]) +
        baseValues.atk * orZero(summed["AttackAddedRatio"])) /
      (maxChAtk + maxLcAtk),
    def:
      (baseValues.def +
        orZero(summed["DefenceDelta"]) +
        baseValues.def * orZero(summed["DefenceAddedRatio"])) /
      (maxChDef + maxLcDef),
    hp:
      (baseValues.hp +
        orZero(summed["HPDelta"]) +
        baseValues.hp * orZero(summed["HPAddedRatio"])) /
      (maxChHp + maxLcHp),
  };

  const result = {
    baseValues,
    propertyList: summed,
    statTable: toStatTable(baseValues, summed),
    normalized,
  };
  console.log("useStatParser ret", result);

  return result;
}

function baseChar(
  level: number,
  ascension: number,
  promoteData: AvatarPromotionConfig
) {
  const { attack_add, attack_base, hpadd, hpbase, defence_add, defence_base } =
    promoteData;
  return {
    atk: attack_base[ascension] + (level - 1) * attack_add[ascension],
    hp: hpbase[ascension] + (level - 1) * hpadd[ascension],
    def: defence_base[ascension] + (level - 1) * defence_add[ascension],
  };
}
function baseLc(
  level: number,
  ascension: number,
  promoteData: EquipmentPromotionConfig | undefined
) {
  if (!!promoteData) {
    const {
      base_attack,
      base_attack_add,
      base_defence,
      base_defence_add,
      base_hp,
      base_hpadd,
    } = promoteData;
    return {
      atk: base_attack[ascension] + (level - 1) * base_attack_add[ascension],
      hp: base_hp[ascension] + (level - 1) * base_hpadd[ascension],
      def: base_defence[ascension] + (level - 1) * base_defence_add[ascension],
    };
  }
  return { atk: 0, hp: 0, def: 0 };
}

function sumProps(
  props: Partial<Record<Property, number>>[]
): Partial<Record<Property, number>> {
  let ret: Partial<Record<Property, number>> = {};
  props.forEach((prop) => {
    Object.entries(prop).forEach(([p, value]) => {
      const property = p as Property;
      if (!ret[property]) ret[property] = value;
      else ret[property]! += value;
    });
  });
  return ret;
}

const ELE_KEYS: Property[] = [
  "FireAddedRatio",
  "IceAddedRatio",
  "PhysicalAddedRatio",
  "WindAddedRatio",
  "ThunderAddedRatio",
  "QuantumAddedRatio",
  "ImaginaryAddedRatio",
];

const CUSTOM_KEYS: Property[] = [
  "AttackAddedRatio",
  "AttackDelta",
  "HPAddedRatio",
  "HPDelta",
  "DefenceAddedRatio",
  "DefenceDelta",
  "SpeedDelta",
  "CriticalChanceBase",
  "CriticalDamageBase",
  // specific ele += all damagetype
  "AllDamageTypeAddedRatio",
  ...ELE_KEYS,
];

function toStatTable(
  baseValue: BaseValueSchema,
  map: Partial<Record<Property, number>>
) {
  const { atk, critical_chance, critical_damage, def, hp, speed } = baseValue;
  // automated keys inside map
  // will be spreaded for autofill
  const automatedKeys: Partial<Record<Property, number>> = Object.fromEntries(
    Object.entries(map).filter(
      ([key, _value]) => !CUSTOM_KEYS.includes(key as Property)
    )
  );
  const eleKeys: Partial<Record<Property, number>> = Object.fromEntries(
    ELE_KEYS.map((key) => [
      key,
      orZero(map[key]) + orZero(map.AllDamageTypeAddedRatio),
    ])
  );

  // leave the trinity to generic keys
  const ret: Partial<Record<Property, number>> = {
    Defence:
      (orZero(map.DefenceAddedRatio, 1) + 1) * def + orZero(map.DefenceDelta),
    MaxHP: (orZero(map.HPAddedRatio, 1) + 1) * hp + orZero(map.HPDelta),
    Attack:
      (orZero(map.AttackAddedRatio, 1) + 1) * atk + orZero(map.AttackDelta),
    Speed: speed + orZero(map.SpeedDelta),
    CriticalChanceBase: critical_chance + orZero(map.CriticalChanceBase),
    CriticalDamageBase: critical_damage + orZero(map.CriticalDamageBase),
    ...eleKeys,
    ...automatedKeys,
  };
  return ret;
}

function orZero(n: number | null | undefined, def?: number): number {
  if (!n) return !!def ? def : 0;
  else return n;
}
