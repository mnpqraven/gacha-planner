import {
  MihomoAttributeConfig,
  MihomoPropertyConfig,
} from "@/app/profile/types";
import { Element } from "@/bindings/AvatarConfig";
import { asPercentage, cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import SVG from "react-inlinesvg";

interface Props extends HTMLAttributes<HTMLDivElement> {
  element: Element;
  attributes: MihomoAttributeConfig[];
  properties: MihomoPropertyConfig[];
  additions: MihomoAttributeConfig[];
}

export const StatTable = forwardRef<HTMLDivElement, Props>(
  (
    { element, attributes, properties, additions, className, ...props },
    ref
  ) => {
    function addStat(
      attributeArray: MihomoAttributeConfig[],
      additionArray: MihomoAttributeConfig[],
      field: string,
      isPercent: boolean = false
    ): string | number {
      const inAttribute = attributeArray.find((e) => e.field == field);
      const inAddition = additionArray.find((e) => e.field == field);

      let value = 0;
      if (field == "sp_rate")
        value = 1 + (inAttribute?.value ?? 0) + (inAddition?.value ?? 0);
      else value = (inAttribute?.value ?? 0) + (inAddition?.value ?? 0);

      return isPercent ? asPercentage(value, 1) : value.toFixed(0);
    }

    return (
      <div className={cn(className)} ref={ref} {...props}>
        {mihomoPropertyList(element).map(({ value, icon, percent }, index) => (
          <div key={index} className="flex">
            <SVG src={icon} width={32} height={32} className="text-white" />
            <div>{addStat(attributes, additions, value, percent)}</div>
          </div>
        ))}
      </div>
    );
  }
);
StatTable.displayName = "StatTable";

function mihomoPropertyList(
  element: Element
): { value: string; icon: string; percent: boolean }[] {
  const ele = {
    value: `${element.toLowerCase()}_dmg`,
    icon: `/property/Icon${
      element == "Lightning" ? "Thunder" : element
    }AddedRatio.svg`,
    percent: true,
  };
  // TODO: field for healing
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
