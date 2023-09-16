import { cn, rotate } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { ParentSize } from "@visx/responsive";
import { SpiderChart } from "./SpiderChart";
import * as z from "zod";
import {
  StatRadarData,
  charAfterPromotion,
  getNormalizedBoundProperty,
  lcAfterPromotion,
  useDataProcess,
} from "./useDataProcess";
import { MihomoCharacter } from "../../types";
import { useCardConfigController } from "../ConfigControllerContext";
import { filterOtherElements } from "./stat_block/StatTable";
import { Element } from "@/bindings/AvatarConfig";
import { prettyProperty, propertyIconUrl } from "@/lib/propertyHelper";
import { Property } from "@/bindings/SkillTreeConfig";
import { useCharacterPromotion } from "@/hooks/queries/useCharacterPromotion";
import { useLightConePromotion } from "@/hooks/queries/useLightConePromotion";

interface Props extends HTMLAttributes<HTMLDivElement> {
  // characterData: MihomoCharacter;
  element: Element;
}
export const SpiderChartWrapper = forwardRef<HTMLDivElement, Props>(
  ({ className, element, ...props }, ref) => {
    // const { data } = useDataProcess({ character: characterData });
    const { parsedStats, currentCharacter } = useCardConfigController();
    const { data: charPromo } = useCharacterPromotion(currentCharacter?.id);
    const { data: lcPromo } = useLightConePromotion(
      Number(currentCharacter?.light_cone.id)
    );

    if (!parsedStats || !charPromo || !lcPromo) return null;

    const speed = parsedStats.baseValues.speed;

    const binding = Object.entries(parsedStats.statTable)
      .reverse()
      .map(([property, value]) => {
        let binding = value;
        switch (property as Property) {
          case "MaxHP":
            binding = parsedStats.normalized.hp;
            break;
          case "Attack":
            binding = parsedStats.normalized.atk;
            break;
          case "Defence":
            binding = parsedStats.normalized.def;
            break;
          case "Speed":
            binding = value - speed;
            break;
        }
        const normalizedValue =
          binding / getNormalizedBoundProperty(property as Property, speed);

        return {
          property: property,
          value,
          normalizedValue,
        };
      })
      .filter(({ property }) => filterOtherElements(property, element)) as {
      property: Property;
      value: number;
      normalizedValue: number;
    }[];

    const data = rotate(binding.length / 2 + 2, binding);

    return (
      <div
        className={cn("relative h-[300px] w-full", className)}
        ref={ref}
        {...props}
      >
        <ParentSize debounceTime={10}>
          {(parent) => (
            <SpiderChart
              width={parent.width}
              height={parent.height}
              data={data}
              valueAccessor={(e: (typeof data)[number]) => e.normalizedValue}
              iconAccessor={(e: (typeof data)[number]) =>
                propertyIconUrl(e.property)
              }
              tooltipRender={({ property, value }: (typeof data)[number]) => {
                const { label, prettyValue } = prettyProperty(property, value);
                return `${label}: ${prettyValue}`;
              }}
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
