"use client";

import { TraceSummary } from "@/app/components/Character/TraceSummary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/Accordion";
import { DbAttributeProperty } from "@/bindings/DbAttributeProperty";
import { DbCharacterSkillTree } from "@/bindings/DbCharacterSkillTree";
import ENDPOINT from "@/server/endpoints";
import { typedFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";

type Props = {
  characterId: number;
};
const TraceSummaryWrapper = ({ characterId }: Props) => {
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

  if (!data || !properties) return null;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-md border p-4"
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="py-0">
          Total gain from traces
        </AccordionTrigger>
        <AccordionContent asChild>
          <TraceSummary
            characterId={characterId}
            skills={data.list}
            properties={properties.list}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export { TraceSummaryWrapper };
