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

export default async function ProfileCard() {
  return (
    <StateProvider devTools>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          {/* <Exporter />
          <ConfigController /> */}
        </div>
        <Accordion type="single" collapsible className="container">
          <AccordionItem value="item-1">
            <AccordionTrigger>Configuration</AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="character" className="w-full">
                <TabsList>
                  <TabsTrigger value="character">Character</TabsTrigger>
                  <TabsTrigger value="lightcone">Light Cone</TabsTrigger>
                  <TabsTrigger value="relic">Relic</TabsTrigger>
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
              {/* <ArmoryEditor /> */}

              <Debugger />
              {/* <CharacterCardWrapper uid={uid} lang={lang} mode="ARMORY" /> */}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Card</AccordionTrigger>
            <AccordionContent>
              <DisplayCard mode="ARMORY" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </StateProvider>
  );
}
