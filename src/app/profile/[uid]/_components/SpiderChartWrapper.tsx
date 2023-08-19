import { cn, rotate } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useContext } from "react";
import { CardConfigContext } from "../ConfigControllerContext";
import { ParentSize } from "@visx/responsive";
import { SpiderChart } from "./SpiderChart";
import * as z from "zod";
import { MihomoAttributeConfig } from "../../types";
import { Element } from "@/bindings/AvatarConfig";
import { useDataProcess } from "./useDataProcess";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const SpiderChartWrapper = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useContext(CardConfigContext);
    const { data } = useDataProcess({ character: currentCharacter });

    if (!currentCharacter) return null;

    return (
      <div
        className={cn("relative h-[300px] w-[300px]", className)}
        ref={ref}
        {...props}
      >
        <ParentSize debounceTime={10}>
          {(parent) => (
            <SpiderChart
              width={parent.width}
              height={parent.height}
              data={data}
              valueAccessor={(e: (typeof data)[number]) => e.value}
              iconAccessor={(e: (typeof data)[number]) => propertyPath(e.field)}
            />
          )}
        </ParentSize>
      </div>
    );
  }
);

// existing fields:
const FIELDS = [
  "hp",
  "atk",
  "def",
  "spd",
  "crit_rate",
  "crit_dmg",
  "break_dmg",
  "heal_rate",
  "sp_rate",
  "effect_hit",
  "effect_res",
  "lightning_dmg",
  "wind_dmg",
  "fire_dmg",
  "quantum_dmg",
  "imaginary_dmg",
  "ice_dmg",
  "physical_dmg",
  "all_dmg",
] as const;
const zField = z.enum(FIELDS);
export type Field = z.infer<typeof zField>;

export function propertyPath(field: Field): string {
  const prefix = (val: string) => `/property/Icon${val}.svg`;
  switch (field) {
    case "hp":
      return prefix("MaxHP");
    case "atk":
      return prefix("Attack");
    case "def":
      return prefix("Defence");
    case "spd":
      return prefix("Speed");
    case "crit_rate":
      return prefix("CriticalChance");
    case "crit_dmg":
      return prefix("CriticalDamage");
    case "break_dmg":
      return prefix("BreakUp");
    case "heal_rate":
      return prefix("HealRatio");
    case "sp_rate":
      return prefix("EnergyRecovery");
    case "effect_hit":
      return prefix("StatusProbability");
    case "effect_res":
      return prefix("StatusResistance");
    case "lightning_dmg":
      return prefix("ThunderAddedRatio");
    case "wind_dmg":
      return prefix("WindAddedRatio");
    case "fire_dmg":
      return prefix("FireAddedRatio");
    case "quantum_dmg":
      return prefix("QuantumAddedRatio");
    case "imaginary_dmg":
      return prefix("ImaginaryAddedRatio");
    case "ice_dmg":
      return prefix("IceAddedRatio");
    case "physical_dmg":
      return prefix("PhysicalAddedRatio");
    case "all_dmg":
      return prefix("AllDamageTypeAddedRatio");
  }
}

SpiderChartWrapper.displayName = "SpiderChartWrapper";
