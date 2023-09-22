import { RelicType } from "@/bindings/RelicConfig";
import { Property } from "@/bindings/RelicSetSkillConfig";
import { ChevronDown, ChevronUp, Minus, X } from "lucide-react";
import { ReactNode } from "react";

const basicProps: Property[] = [
  "HPAddedRatio",
  "AttackAddedRatio",
  "DefenceAddedRatio",
];
export const relicMainstatOptions: {
  type: RelicType;
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

export const substatRollButtons: {
  label: string;
  icon: ReactNode;
  key: "HIGH" | "MID" | "LOW" | "NONE";
}[] = [
  {
    label: "High Roll",
    icon: <ChevronUp />,
    key: "HIGH",
  },
  {
    label: "Normal Roll",
    icon: <Minus />,
    key: "MID",
  },
  {
    label: "Low Roll",
    icon: <ChevronDown />,
    key: "LOW",
  },
  {
    label: "Remove Roll",
    icon: <X />,
    key: "NONE",
  },
];
