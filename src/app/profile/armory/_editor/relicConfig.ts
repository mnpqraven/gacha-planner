import { Property } from "@/bindings/RelicSetSkillConfig";
import { RelicCategory } from "../schema";

const basicProps: Property[] = [
  "HPAddedRatio",
  "AttackAddedRatio",
  "DefenceAddedRatio",
];
export const relicMainstatOptions: {
  type: RelicCategory;
  options: Property[];
}[] = [
  { type: "HEAD", options: ["HPDelta"] },
  { type: "HAND", options: ["AttackDelta"] },
  {
    type: "BODY",
    options: [
      ...basicProps,
      "CriticalChanceBase",
      "CriticalDamageBase",
      "HealRatioBase",
      "StatusProbabilityBase",
    ],
  },
  {
    type: "FOOT",
    options: [...basicProps, "SpeedDelta"],
  },
  {
    type: "OBJECT",
    options: [
      ...basicProps,
      "PhysicalAddedRatio",
      "FireAddedRatio",
      "IceAddedRatio",
      "ThunderAddedRatio",
      "WindAddedRatio",
      "QuantumAddedRatio",
      "ImaginaryAddedRatio",
    ],
  },
  {
    type: "NECK",
    options: [...basicProps, "BreakDamageAddedRatioBase", "SPRatioBase"],
  },
];

export const subStatOptions: { option: Property }[] = [
  { option: "HPAddedRatio" },
  { option: "AttackAddedRatio" },
  { option: "DefenceAddedRatio" },
  { option: "HPDelta" },
  { option: "AttackDelta" },
  { option: "DefenceDelta" },
  { option: "SpeedDelta" },
  { option: "CriticalChanceBase" },
  { option: "CriticalDamageBase" },
  { option: "StatusProbabilityBase" },
  { option: "StatusResistanceBase" },
  { option: "BreakDamageAddedRatioBase" },
];

export function propertyIsPercent(property: Property): boolean {
  return !property.endsWith("Delta");
}

export function propertyIconUrl(property: Property): string {
  let url = "";
  switch (property) {
    case "BreakDamageAddedRatio":
    case "BreakDamageAddedRatioBase":
      url = "BreakUp";
      break;
    case "MaxSP":
      url = "EnergyLimit";
      break;
    case "SPRatio":
    case "SPRatioBase":
      url = "EnergyRecovery";
      break;
    case "StatusProbability":
    case "StatusResistance":
    case "CriticalChanceBase":
      url = "CriticalChance";
      break;
    case "CriticalDamageBase":
      url = "CriticalDamage";
      break;
    case "HealRatioBase":
      url = "HealRatio";
      break;
    case "StatusProbabilityBase":
      url = "StatusProbability";
      break;
    case "StatusResistanceBase":
      url = "StatusResistance";
      break;
    case "BaseHP":
    case "HPDelta":
    case "HPAddedRatio":
      url = "MaxHP";
      break;
    case "BaseAttack":
    case "AttackDelta":
    case "AttackAddedRatio":
      url = "Attack";
      break;
    case "BaseDefence":
    case "DefenceDelta":
    case "DefenceAddedRatio":
      url = "Defence";
      break;
    case "BaseSpeed":
    case "SpeedDelta":
      url = "Speed";
      break;
    default:
      url = property;
      break;
  }
  return `/property/Icon${url}.svg`;
}

export function propertyName(property: Property): string {
  switch (property) {
    case "MaxHP":
      return "Max HP";
    case "Attack":
      return "Attack";
    case "Defence":
      return "DEF";
    case "Speed":
      return "Speed";
    case "CriticalChance":
      return "Crit Rate";
    case "CriticalDamage":
      return "Crit DMG";
    case "BreakDamageAddedRatio":
    case "BreakDamageAddedRatioBase":
      return "Break Effect";
    case "HealRatio":
      return "Outgoing Heal";
    case "SPRatio":
    case "SPRatioBase":
      return "Energy Regen";
    case "StatusProbability":
    case "StatusProbabilityBase":
      return "Effect Hit";
    case "StatusResistance":
    case "StatusResistanceBase":
      return "Effect RES";
    case "CriticalChanceBase":
      return "Crit Rate";
    case "CriticalDamageBase":
      return "Crit DMG";
    case "HealRatioBase":
      return "Outgoing Heal";
    case "StanceBreakAddedRatio":
      return "Break Efficiency";
    case "PhysicalAddedRatio":
      return "Physical DMG";
    case "PhysicalResistance":
      return "Physical RES";
    case "FireAddedRatio":
      return "Fire DMG";
    case "FireResistance":
      return "Fire RES";
    case "IceAddedRatio":
      return "Ice DMG";
    case "IceResistance":
      return "Ice RES";
    case "ThunderAddedRatio":
      return "Lightning DMG";
    case "ThunderResistance":
      return "Lightning RES";
    case "WindAddedRatio":
      return "Wind DMG";
    case "WindResistance":
      return "Wind RES";
    case "QuantumAddedRatio":
      return "Quantum DMG";
    case "QuantumResistance":
      return "Quantum RES";
    case "ImaginaryAddedRatio":
      return "Imaginary DMG";
    case "ImaginaryResistance":
      return "Imaginary RES";
    case "BaseHP":
    case "HPDelta":
      return "HP";
    case "HPAddedRatio":
      return "HP %";
    case "BaseAttack":
      return "ATK";
    case "AttackDelta":
      return "ATK";
    case "AttackAddedRatio":
      return "ATK %";
    case "BaseDefence":
      return "DEF";
    case "DefenceDelta":
      return "DEF";
    case "DefenceAddedRatio":
      return "DEF %";
    case "BaseSpeed":
      return "SPD";
    case "HealTakenRatio":
      return "";
    case "SpeedDelta":
      return "SPD";
    case "SpeedAddedRatio":
      return "SPD %";
    case "AllDamageTypeAddedRatio":
      return "DMG";
    default:
      return property;
  }
}
