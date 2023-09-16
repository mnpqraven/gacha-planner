import { Property } from "@/bindings/SkillTreeConfig";
import { asPercentage } from "./utils";

export function isPropertyPercent(property: Property) {
  switch (property) {
    case "MaxHP":
    case "Attack":
    case "Defence":
    case "Speed":
    case "MaxSP":
    case "BaseHP":
    case "BaseAttack":
    case "BaseDefence":
    case "BaseSpeed":
      return false;
    default:
      return !property.endsWith("Delta");
  }
}

export function propertyIconUrl(property: Property) {
  const url = (name: string) => `/property/${name}.svg`;
  switch (property) {
    case "MaxHP":
    case "Attack":
    case "Defence":
    case "Speed":
    case "CriticalChance":
    case "CriticalDamage":
    case "HealRatio":
    case "PhysicalAddedRatio":
    case "FireAddedRatio":
    case "IceAddedRatio":
    case "ThunderAddedRatio":
    case "WindAddedRatio":
    case "QuantumAddedRatio":
    case "ImaginaryAddedRatio":
    case "PhysicalResistanceDelta":
    case "FireResistanceDelta":
    case "IceResistanceDelta":
    case "ThunderResistanceDelta":
    case "WindResistanceDelta":
    case "QuantumResistanceDelta":
    case "ImaginaryResistanceDelta":
      return url(`Icon${property}`);
    case "BreakDamageAddedRatio":
    case "BreakDamageAddedRatioBase":
    case "StanceBreakAddedRatio":
      return url("IconBreakUp");
    case "MaxSP":
      return url("IconEnergyLimit");
    case "SPRatio":
    case "SPRatioBase":
      return url("IconEnergyRecovery");
    case "CriticalChanceBase":
      return url("IconCriticalChance");
    case "CriticalDamageBase":
      return url("IconCriticalDamage");
    case "HealRatioBase":
      return url("IconHealRatio");
    case "StatusProbability":
    case "StatusProbabilityBase":
      return url("IconStatusProbability");
    case "StatusResistance":
    case "StatusResistanceBase":
      return url("IconStatusResistance");
    case "PhysicalResistance":
    case "FireResistance":
    case "IceResistance":
    case "ThunderResistance":
    case "WindResistance":
    case "QuantumResistance":
    case "ImaginaryResistance":
      return url(`Icon${property}Delta`);
    case "BaseHP":
    case "HPDelta":
    case "HPAddedRatio":
      return url("IconMaxHP");
    case "BaseAttack":
    case "AttackDelta":
    case "AttackAddedRatio":
      return url("IconAttack");
    case "BaseDefence":
    case "DefenceDelta":
    case "DefenceAddedRatio":
      return url("IconDefence");
    case "BaseSpeed":
    case "SpeedDelta":
    case "SpeedAddedRatio":
      return url("IconSpeed");
    case "HealTakenRatio":
      return url("IconHealRatio");
    case "AllDamageTypeAddedRatio":
      return url("IconAttack");
    default:
      return "";
  }
}

function propertyLabel(property: Property): string {
  switch (property) {
    case "MaxHP":
      return "HP";
    case "Attack":
      return "ATK";
    case "Defence":
      return "DEF";
    case "Speed":
      return "Speed";
    case "CriticalChance":
    case "CriticalChanceBase":
      return "Crit Rate";
    case "CriticalDamage":
    case "CriticalDamageBase":
      return "Crit DMG";
    case "BreakDamageAddedRatio":
    case "BreakDamageAddedRatioBase":
      return "Break Effect";
    case "MaxSP":
      return "Max Energy";
    case "SPRatio":
    case "SPRatioBase":
      return "Energy Regen";
    case "StatusProbability":
    case "StatusProbabilityBase":
      return "Effect Hit";
    case "StatusResistance":
    case "StatusResistanceBase":
      return "Effect Res";
    case "HealRatio":
    case "HealRatioBase":
    case "HealTakenRatio":
      return "Outgoing Heal";
    case "StanceBreakAddedRatio":
      return "Break Efficiency";
    case "PhysicalAddedRatio":
      return 'Physical DMG'
    case "PhysicalResistanceDelta":
    case "PhysicalResistance":
      return 'Physical RES'
    case "FireAddedRatio":
      return 'Fire DMG'
    case "FireResistanceDelta":
    case "FireResistance":
      return 'Fire RES'
    case "IceAddedRatio":
      return 'Ice DMG'
    case "IceResistanceDelta":
    case "IceResistance":
      return 'Ice RES'
    case "ThunderAddedRatio":
      return 'Lightning DMG'
    case "ThunderResistanceDelta":
    case "ThunderResistance":
      return 'Lightning RES'
    case "WindAddedRatio":
      return 'Wind DMG'
    case "WindResistanceDelta":
    case "WindResistance":
      return 'Wind RES'
    case "QuantumAddedRatio":
      return 'Quantum DMG'
    case "QuantumResistanceDelta":
    case "QuantumResistance":
      return 'Quantum RES'
    case "ImaginaryAddedRatio":
      return 'Imaginary DMG'
    case "ImaginaryResistanceDelta":
    case "ImaginaryResistance":
      return 'Imaginary RES'
    case "BaseHP":
    case "HPDelta":
      return 'HP'
    case "HPAddedRatio":
      return 'HP %'
    case "BaseAttack":
    case "AttackDelta":
      return 'ATK'
    case "AttackAddedRatio":
      return 'ATK %'
    case "BaseDefence":
    case "DefenceDelta":
      return 'DEF'
    case "DefenceAddedRatio":
      return 'DEF %'
    case "BaseSpeed":
    case "SpeedDelta":
    case "SpeedAddedRatio":
      return 'Speed'
    case "AllDamageTypeAddedRatio":
      return 'DMG %'
    default:
      return "";
  }
}

export function prettyProperty(property: Property, value: number) {
  return {
    label: propertyLabel(property),
    prettyValue: isPropertyPercent(property)
      ? asPercentage(value, 1)
      : value.toFixed(1),
  };
}
