import { Element } from "@/bindings/AvatarConfig";
import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import SVG from "react-inlinesvg";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { Property } from "@/bindings/SkillTreeConfig";
import {
  prettyProperty,
  propertyIconUrl,
  sortByProperty,
} from "@/lib/propertyHelper";
import { useAtomValue } from "jotai";
import { statParseParam } from "@/app/card/_store";
import { useStatParser } from "@/hooks/useStatParser";
import { hoverVerbosityAtom } from "@/app/card/_store/main";

interface Props extends HTMLAttributes<HTMLDivElement> {
  element: Element;
}

export const StatTable = forwardRef<HTMLDivElement, Props>(
  ({ element, className, ...props }, ref) => {
    const hoverVerbosity = useAtomValue(hoverVerbosityAtom);
    const parsedStats = useStatParser(useAtomValue(statParseParam));

    if (!parsedStats) return null;

    const asObject = Object.entries(parsedStats.statTable)
      .map(([property, value]) => ({
        property,
        value,
      }))
      .filter(({ property }) => filterOtherElements(property, element))
      .sort((a, b) =>
        sortByProperty(a.property as Property, b.property as Property)
      ) as {
      property: Property;
      value: number;
    }[];

    return (
      <div
        className={cn(
          "rounded-md border p-2 shadow-md shadow-border",
          className
        )}
        ref={ref}
        {...props}
      >
        {asObject.map(({ property, value }, index) => (
          <Tooltip key={property}>
            <TooltipTrigger
              disabled={hoverVerbosity === "none"}
              className={cn(
                "flex items-center gap-2 py-1",
                index % 2 === 0 ? "border-r" : ""
              )}
            >
              <SVG
                src={propertyIconUrl(property)}
                className="text-black dark:text-white"
              />
              <div>{prettyProperty(property, value).prettyValue}</div>
            </TooltipTrigger>

            {hoverVerbosity !== "none" && (
              <TooltipContent side={index % 2 === 0 ? "left" : "right"}>
                {prettyProperty(property, value).label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    );
  }
);
StatTable.displayName = "StatTable";

export function filterOtherElements(
  property: string,
  element: Element
): boolean {
  const exceptLightning = [
    "Fire",
    "Ice",
    "Physical",
    "Wind",
    "Quantum",
    "Imaginary",
  ];

  if (property.includes("Thunder")) return element == "Lightning";
  else if (exceptLightning.some((ele) => property.includes(ele)))
    return property.includes(element);
  else return true;
}
