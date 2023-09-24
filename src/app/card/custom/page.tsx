import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import { CharacterEditorTab } from "./_tabs/CharacterEditorTab";
import { StateProvider } from "../StateProvider";
import { LightConeEditorTab } from "./_tabs/LightConeEditorTab";
import { RelicEditorTab } from "./_tabs/RelicEditorTab";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/Accordion";
import { DisplayCard } from "./_viewer/DisplayCard";
import { Exporter } from "../[uid]/_components/Exporter";
import { ConfigController } from "../[uid]/ConfigControllerDialog";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";

export default async function ProfileCard() {
  return (
    <StateProvider devTools>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          <Button variant="outline">
            <Link href="/card">Use UID</Link>
          </Button>
          <Exporter />
          <ConfigController />
        </div>
        <Accordion
          type="multiple"
          // collapsible
          className="w-10/12"
          defaultValue={["config-accordion", "card-accordion"]}
        >
          <AccordionItem value="config-accordion">
            <AccordionTrigger>Configuration</AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="charlc" className="w-full">
                <TabsList>
                  <TabsTrigger value="charlc">
                    Character & Light Cone
                  </TabsTrigger>
                  <TabsTrigger value="relic">Relics</TabsTrigger>

                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="mx-2 text-yellow-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Substat roll window is still under development and won
                      {"'"}t verify if the value you{"'"}ve inputted is valid.
                      <br />
                      For now if you want accurate substat roll values please
                      click on the roll buttons one by one instead of inputting
                      specific value
                    </TooltipContent>
                  </Tooltip>
                </TabsList>

                <TabsContent value="charlc" className="flex">
                  <CharacterEditorTab />
                  <LightConeEditorTab />
                </TabsContent>
                <TabsContent value="relic">
                  <RelicEditorTab />
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="card-accordion">
            <AccordionTrigger>Card</AccordionTrigger>
            <AccordionContent className="flex justify-center">
              <DisplayCard mode="CUSTOM" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </StateProvider>
  );
}