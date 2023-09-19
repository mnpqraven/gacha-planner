import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import { CharacterEditorTab } from "./_tabs/CharacterEditorTab";
import { StateProvider } from "./StateProvider";
import { Debugger } from "./Debugger";
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

export default async function ProfileCard() {
  return (
    <StateProvider devTools>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          <Exporter />
          <ConfigController />
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-10/12"
          defaultValue="config-accordion"
        >
          <AccordionItem value="config-accordion">
            <AccordionTrigger>Configuration</AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="character" className="w-full">
                <TabsList>
                  <TabsTrigger value="character">
                    Character & Traces
                  </TabsTrigger>
                  <TabsTrigger value="lightcone">Light Cone & User</TabsTrigger>
                  <TabsTrigger value="relic">Relics</TabsTrigger>
                </TabsList>

                <TabsContent value="character">
                  <CharacterEditorTab />
                </TabsContent>
                <TabsContent value="lightcone">
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
              <DisplayCard mode="ARMORY" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </StateProvider>
  );
}
