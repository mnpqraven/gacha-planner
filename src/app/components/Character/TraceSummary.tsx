"use client";

import { DbAttributeProperty, Property } from "@/bindings/DbAttributeProperty";
import { DbCharacterSkillTree } from "@/bindings/DbCharacterSkillTree";
import { IMAGE_URL } from "@/server/endpoints";
import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { asPercentage } from "@/lib/utils";

type Haystack = {
  [Key in Property]?: { value: number; icon: string };
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
  skills: DbCharacterSkillTree[];
  properties: DbAttributeProperty[];
}

const TraceSummary = forwardRef<HTMLDivElement, Props>(
  ({ characterId, skills, properties, ...props }, ref) => {
    let hay: Haystack = {};
    skills.forEach((traceNode) => {
      let property = traceNode.levels[0].properties[0];

      if (property && property.ttype) {
        const { ttype: key, value } = property;

        // upserting
        if (!hay[key]) hay[key] = { value, icon: traceNode.icon };
        else
          hay[key] = { value: hay[key]!.value + value, icon: traceNode.icon };
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

function propertyUrl(path: string | undefined) {
  return IMAGE_URL + path;
}

export { TraceSummary };
