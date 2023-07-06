'use client'

import { DbAttributeProperty, Property } from "@/bindings/DbAttributeProperty";
import { DbCharacterSkillTree } from "@/bindings/DbCharacterSkillTree";
import ENDPOINT, { IMAGE_URL } from "@/server/endpoints";
import { typedFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  characterId: number;
};
function TraceSummary({ characterId }: Props) {
  const { data } = useQuery({
    queryKey: ["trace", characterId],
    queryFn: async () =>
      await typedFetch<undefined, { list: DbCharacterSkillTree[] }>(
        ENDPOINT.mhyTrace,
        undefined,
        characterId
      ),
  });

  const { data: properties } = useQuery({
    queryKey: ["attribute_property"],
    queryFn: async () =>
      await typedFetch<undefined, { list: DbAttributeProperty[] }>(
        ENDPOINT.mhyAttributeProperty
      ),
  });

  type Haystack = {
    [Key in Property]?: { value: number; icon: string };
  };

  const [substatHaystack, setSubstatHaystack] = useState<Haystack>({});

  useEffect(() => {
    if (data) {
      let t: Haystack = {};
      data.list.forEach((traceNode) => {
        let property = traceNode.levels[0].properties[0];

        if (property && property.ttype) {
          const { ttype: key, value } = property;

          // upserting
          if (!t[key]) t[key] = { value, icon: traceNode.icon };
          else t[key] = { value: t[key]!.value + value, icon: traceNode.icon };
        }
      });
      setSubstatHaystack(t);
    }
  }, [data]);

  if (!data || !substatHaystack) return null;
  return (
    <>
      {Object.keys(substatHaystack)
        .sort((a, b) => a.localeCompare(b))
        .map((key, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={propertyUrl(
                  substatHaystack[key as keyof typeof substatHaystack]?.icon
                )}
                alt={key}
                width={128}
                height={128}
                className="aspect-square h-8 w-8"
              />
              {properties?.list.find((e) => e.type == (key as Property))?.name}:{' '}
            </div>
            <div>
              {formatNumber(
                substatHaystack[key as keyof typeof substatHaystack]?.value
              )}
            </div>
          </div>
        ))}
    </>
  );
}

/**
 * This function removes trailing zeroes if it's a whole number (eg. 18.00)
 * Otherwise a float percent with 2 decimals is returned
 */
function formatNumber(data: number | undefined): string {
  if (!data) return "0 %";
  else {
    return Number(`${(data * 100).toFixed(2)}`).toString() + " %";
  }
}

function propertyUrl(path: string | undefined) {
  return IMAGE_URL + path;
}

export { TraceSummary };
