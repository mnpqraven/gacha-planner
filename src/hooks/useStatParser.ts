import { AvatarPromotionConfig } from "@/bindings/AvatarPromotionConfig";
import { useCharacterPromotion } from "./queries/useCharacterPromotion";
import { useCharacterTrace } from "./queries/useCharacterTrace";
import { useLightConePromotion } from "./queries/useLightConePromotion";
import { EquipmentPromotionConfig } from "@/bindings/EquipmentPromotionConfig";
import { Property } from "@/bindings/RelicSubAffixConfig";
import { RelicCategory } from "@/app/profile/armory/schema";
import { useRelicSetBonuses } from "./queries/useRelicSetBonus";

type BasicMetadata = { id: number; level: number; ascension: number };
type RelicSchema = {
  id: number;
  setId: number;
  // INFO: not yet needed
  // type: RelicCategory;
  level: number;
  mainStat: {
    property: Property;
    value: number;
  };
  subStat: { property: Property; step: number; value: number }[];
};

interface Props {
  character: BasicMetadata;
  traceTable: Record<string | number, boolean>;
  lightCone: BasicMetadata;
  relic: RelicSchema[];
}

export function useStatParser(props?: Props) {
  const { data: traceData } = useCharacterTrace(props?.character.id);
  const { data: charPromotionData } = useCharacterPromotion(
    props?.character.id
  );
  const { data: lcPromotionData } = useLightConePromotion(props?.lightCone.id);
  const { data: relicBonuses } = useRelicSetBonuses();

  if (
    !traceData ||
    !charPromotionData ||
    !lcPromotionData ||
    !props ||
    !relicBonuses
  )
    return undefined;

  const { ascension: charAscension, level: charLevel } = props.character;
  const { ascension: lcAscension, level: lcLevel } = props.lightCone;

  const baseCharValues = baseChar(charLevel, charAscension, charPromotionData);
  const baseLcValues = baseLc(lcLevel, lcAscension, lcPromotionData);

  const baseValues = {
    atk: baseCharValues.atk + baseLcValues.atk,
    hp: baseCharValues.hp + baseLcValues.hp,
    def: baseCharValues.def + baseLcValues.def,
    speed: charPromotionData.speed_base,
    critical_chance: charPromotionData.critical_chance,
    critical_damage: charPromotionData.critical_damage,
  };

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
    if (!traceTotal[property]) {
      traceTotal[property] = value;
    } else {
      traceTotal[property]! += value;
    }
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
  const subStatNoStep = (relic: RelicSchema) =>
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
  console.log("props", traceTotal, relicTotal);

  // TODO: parse relic data then multiply base with trace altogether

  const additions = {
    // atk: baseValues.atk * traceTotal.atk * relicTotal.atkPercent + relicTotal.atk
  };

  const result = {
    base: baseValues,
    additions: [0],
    properties: [0],
  };

  console.log("HOOK", result);
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
  promoteData: EquipmentPromotionConfig
) {
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
