import { cn, rotate } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useContext } from "react";
import { CardConfigContext } from "../ConfigControllerContext";
import { addStat, mihomoPropertyList } from "./stat_block/StatTable";
import { ParentSize } from "@visx/responsive";
import { SpiderChart } from "./SpiderChart";
import * as z from "zod";
import { MihomoAttributeConfig } from "../../types";
import { Element } from "@/bindings/AvatarConfig";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const SpiderChartWrapper = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useContext(CardConfigContext);

    if (!currentCharacter) return null;
    const { attributes, additions, element } = currentCharacter;
    const rawData = mihomoPropertyList(element.name).map(({ percent, value }) =>
      addStat(attributes, additions, value, percent)
    );
    console.log("rawData", rawData);
    // console.log("attributes", attributes);
    // console.log("addition", additions);
    const normalizedData = normalizeData(attributes, additions);

    const data = normalizedData
      .map(({ field, value: val }) => {
        const [lowerBound, upperBound] = getBounds(field);
        console.log(field, val, upperBound);
        return {
          field,
          // base of 100
          value: val / upperBound,
        };
      })
      .filter((e) => e.value > 0);

    console.log("final", data);
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

function useDataAnalyze() {
  // total subs is 6 pieces * 5 sub rolls = 30 for a field
  // 6 rolls multiple times is too improbable

  // resolves how much the worth ration between the main stat (at current level)
  // and a substat roll
  function getWeightRation(field: Field): number {
    return 0;
  }

  // return { normalizeData };
}

function unwrapOrDefault(
  data: MihomoAttributeConfig | undefined,
  field: Field
): number {
  switch (field) {
    case "hp":
    case "atk":
    case "def":
    case "spd":
      return data?.value ?? 0;
    case "crit_rate":
      // return data?.value ?? 0.05;
      return data?.value ?? 0;
    case "crit_dmg":
      // return data?.value ?? 0.5;
      return data?.value ?? 0;
    case "sp_rate":
    case "break_dmg":
    case "heal_rate":
    case "effect_hit":
    case "effect_res":
    case "lightning_dmg":
    case "wind_dmg":
    case "fire_dmg":
    case "quantum_dmg":
    case "imaginary_dmg":
    case "ice_dmg":
    case "physical_dmg":
    // element dmg
    default:
      return data?.value ?? 0;
  }
}
// upper bound in percentage value for the chart
function getBounds(field: Field): [number, number] {
  switch (field) {
    case "hp":
      return [0, 3];
    case "atk":
      return [0, 3];
    case "def":
      return [0, 4];
    case "spd":
      return [0.9, 1.82];
    case "crit_rate":
      return [0.05, 0.8];
    case "crit_dmg":
      return [0.5, 2.0];
    case "break_dmg":
      return [0, 2.0];
    case "heal_rate":
      return [0, 0.68];
    case "sp_rate":
      return [0, 0.38];
    case "effect_hit":
    case "effect_res":
      return [0, 1.3];
    case "lightning_dmg":
    case "wind_dmg":
    case "fire_dmg":
    case "quantum_dmg":
    case "imaginary_dmg":
    case "ice_dmg":
    case "physical_dmg":
      return [0, 0.76];
  }
}

function normalizeData(
  // <T extends { field: string; value: number; percent: boolean }[]>
  attributes: MihomoAttributeConfig[],
  additions: MihomoAttributeConfig[]
) {
  const data = FIELDS.map((field) => {
    const attribute = attributes.find((e) => e.field == field);
    const addition = additions.find((e) => e.field == field);
    const left = unwrapOrDefault(attribute, field);
    const right = unwrapOrDefault(addition, field);

    const numerator = left + right;
    let denominator = left;
    if (field == "crit_rate" || field == "crit_dmg") denominator = 1;

    const value = denominator == 0 ? numerator : numerator / denominator;

    return { field, value };
  });
  return data;
}

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
      return prefix("ImagineryAddedRatio");
    case "ice_dmg":
      return prefix("IceAddedRatio");
    case "physical_dmg":
      return prefix("PhysicalAddedRatio");
  }
}

SpiderChartWrapper.displayName = "SpiderChartWrapper";
