import { Element } from "@/bindings/AvatarConfig";
import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import SVG from "react-inlinesvg";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { CardConfig } from "../../configReducer";
import { Property } from "@/bindings/SkillTreeConfig";
import {
  prettyProperty,
  propertyIconUrl,
  sortByProperty,
} from "@/lib/propertyHelper";

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: Partial<Record<Property, number>>;
  element: Element;
  config: CardConfig;
}

export const StatTable = forwardRef<HTMLDivElement, Props>(
  ({ data, element, config, className, ...props }, ref) => {
    const asObject = Object.entries(data)
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
              disabled={config.hoverVerbosity === "none"}
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

            {config.hoverVerbosity !== "none" && (
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
