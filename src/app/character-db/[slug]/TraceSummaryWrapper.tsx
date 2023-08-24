"use client";

import { TraceSummary } from "@/app/components/Character/TraceSummary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/Accordion";
import { useProperties } from "@/hooks/queries/useProperties";
import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

type Props = {
  characterId: number;
};
const TraceSummaryWrapper = ({ characterId }: Props) => {
  const { data } = useQuery({
    queryKey: ["trace", characterId],
    queryFn: async () => await API.trace.get(characterId),
  });

  const { data: properties } = useProperties();

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
            properties={properties}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export { TraceSummaryWrapper };
