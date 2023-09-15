import {
  MihomoAttributeConfig,
  MihomoPropertyConfig,
} from "@/app/profile/types";
import { Element } from "@/bindings/AvatarConfig";
import { asPercentage, cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import SVG from "react-inlinesvg";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { CardConfig } from "../../configReducer";
import { Property } from "@/bindings/SkillTreeConfig";
import { BaseValueSchema } from "@/hooks/useStatParser";

interface Props extends HTMLAttributes<HTMLDivElement> {
  element: Element;
  attributes: MihomoAttributeConfig[];
  properties: MihomoPropertyConfig[];
  additions: MihomoAttributeConfig[];
  config: CardConfig;
}

export const StatTable = forwardRef<HTMLDivElement, Props>(
  (
    { element, attributes, properties, additions, config, className, ...props },
    ref
  ) => {
    // filter out empty stat and 100% sp_rate
    const statTable = mihomoPropertyList(element).filter(
      ({ value, percent }) => {
        const stat = addStat(attributes, additions, value, percent);
        if (stat.isEmpty || (stat.field == "sp_rate" && stat.value == 1))
          return false;
        return true;
      }
    );

    return (
      <div
        className={cn(
          "rounded-md border p-2 shadow-md shadow-border",
          className
        )}
        ref={ref}
        {...props}
      >
        {statTable.map(({ value, icon, percent }, index) => (
          <Tooltip key={index}>
            <TooltipTrigger
              disabled={config.hoverVerbosity === "none"}
              className={cn(
                "flex items-center gap-2 py-1",
                index % 2 === 0 ? "border-r" : ""
              )}
            >
              <SVG src={icon} className="text-black dark:text-white" />
              <div>
                {addStat(attributes, additions, value, percent).valueDisplay}
              </div>
            </TooltipTrigger>

            {config.hoverVerbosity !== "none" && (
              <TooltipContent side={index % 2 === 0 ? "left" : "right"}>
                {addStat(attributes, additions, value, percent).label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    );
  }
);
StatTable.displayName = "StatTable";

export function addStat(
  attributeArray: MihomoAttributeConfig[],
  additionArray: MihomoAttributeConfig[],
  field: string,
  isPercent: boolean = false
): {
  label: string;
  valueDisplay: string;
  isEmpty: boolean;
  value: number;
  field: string;
  percent: boolean;
} {
  const inAttribute = attributeArray.find((e) => e.field == field);
  const inAddition = additionArray.find((e) => e.field == field);

  let value = 0;
  if (field == "sp_rate")
    value = 1 + (inAttribute?.value ?? 0) + (inAddition?.value ?? 0);
  else value = (inAttribute?.value ?? 0) + (inAddition?.value ?? 0);

  return {
    label: inAttribute?.name ?? inAddition?.name ?? "",
    valueDisplay: isPercent ? asPercentage(value, 1) : value.toFixed(0),
    isEmpty: value === 0,
    value,
    field,
    percent: isPercent,
  };
}

export function mihomoPropertyList(
  element: Element
): { value: string; icon: string; percent: boolean }[] {
  const ele = {
    value: `${element.toLowerCase()}_dmg`,
    icon: `/property/Icon${
      element == "Lightning" ? "Thunder" : element
    }AddedRatio.svg`,
    percent: true,
  };
  const fields = [
    { value: "hp", icon: "/property/IconMaxHP.svg", percent: false },
    { value: "atk", icon: "/property/IconAttack.svg", percent: false },
    {
      value: "def",
      icon: "/property/IconDefence.svg",
      percent: false,
    },
    { value: "spd", icon: "/property/IconSpeed.svg", percent: false },
    {
      value: "crit_rate",
      icon: "/property/IconCriticalChance.svg",
      percent: true,
    },
    {
      value: "crit_dmg",
      icon: "/property/IconCriticalDamage.svg",
      percent: true,
    },
    {
      value: "break_dmg",
      icon: "/property/IconBreakUp.svg",
      percent: true,
    },
    {
      value: "heal_rate",
      icon: "/property/IconHealRatio.svg",
      percent: true,
    },
    {
      value: "sp_rate",
      icon: "/property/IconEnergyRecovery.svg",
      percent: true,
    },
    {
      value: "effect_hit",
      icon: "/property/IconStatusProbability.svg",
      percent: true,
    },
    {
      value: "effect_res",
      icon: "/property/IconStatusResistance.svg",
      percent: true,
    },
  ];
  return [...fields, ele];
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
  // specific ele += all damagetype
  "AllDamageTypeAddedRatio",
  ...ELE_KEYS,
];

function toStatTable(
  baseValue: BaseValueSchema,
  map: Partial<Record<Property, number>>
) {
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
      (map[key] ?? 0) + (map.AllDamageTypeAddedRatio ?? 0),
    ])
  );

  // leave the trinity to generic keys
  const ret: Partial<Record<Property, number>> = {
    MaxHP: (map.HPAddedRatio ?? 1) * baseValue.hp + (map.HPDelta ?? 0),
    Attack:
      (map.AttackAddedRatio ?? 1) * baseValue.atk + (map.AttackDelta ?? 0),
    Defence:
      (map.DefenceAddedRatio ?? 1) * baseValue.def + (map.DefenceDelta ?? 0),
    Speed: baseValue.speed + (map.SpeedDelta ?? 0),
    ...eleKeys,
    ...automatedKeys,
  };
  return ret;
}
