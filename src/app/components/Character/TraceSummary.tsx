"use client";

import { DbAttributeProperty, Property } from "@/bindings/DbAttributeProperty";
import { IMAGE_URL } from "@/server/endpoints";
import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { asPercentage } from "@/lib/utils";
import { SkillTreeConfig } from "@/bindings/SkillTreeConfig";

type Haystack = {
  [Key in Property]?: { value: number; icon: string; label: string };
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
  skills: SkillTreeConfig[];
  properties: DbAttributeProperty[];
}

const TraceSummary = forwardRef<HTMLDivElement, Props>(
  ({ characterId, skills, properties, ...props }, ref) => {
    let hay: Haystack = {};
    skills.forEach((traceNode) => {
      let property = traceNode.status_add_list[0];

      if (property && property.property_type) {
        const {
          property_type: key,
          value: { value },
        } = property;

        // upserting
        if (!hay[key])
          hay[key] = {
            value,
            icon: traceNode.icon_path,
            label: traceNode.point_name,
          };
        else
          hay[key] = {
            value: hay[key]!.value + value,
            icon: traceNode.icon_path,
            label: traceNode.point_name,
          };
      }
    });

    return (
      <div ref={ref} {...props}>
        {Object.keys(hay)
          .sort((a, b) => a.localeCompare(b))
          .map((key, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={propertyUrl(hay[key as keyof typeof hay]?.icon)}
                  alt={key}
                  width={128}
                  height={128}
                  className="aspect-square h-8 w-8"
                />
                {properties.find((e) => e.type == (key as Property))?.name}
              </div>

              <div>{asPercentage(hay[key as keyof typeof hay]?.value)}</div>
            </div>
          ))}
      </div>
    );
  }
);
TraceSummary.displayName = "TraceSummary";

function propertyUrl(icon: string | undefined) {
  const lastSlash = icon?.lastIndexOf('/')
  return `${IMAGE_URL}icon/property${icon?.slice(lastSlash)}`;
}

export { TraceSummary };
