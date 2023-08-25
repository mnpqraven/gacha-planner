"use client";

import { TraceSummary } from "@/app/components/Character/TraceSummary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/Accordion";
import { useCharacterTrace } from "@/hooks/queries/useCharacterTrace";
import { useProperties } from "@/hooks/queries/useProperties";

type Props = {
  characterId: number;
};
const TraceSummaryWrapper = ({ characterId }: Props) => {
  const { data: traces } = useCharacterTrace(characterId);
  const { data: properties } = useProperties();

  if (!traces || !properties) return null;

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
            skills={traces}
            properties={properties}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export { TraceSummaryWrapper };
