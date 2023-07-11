import { EidolonTable } from "@/app/components/Character/EidolonTable";
import { SkillOverview } from "@/app/components/Character/SkillOverview";
import { TraceTable } from "@/app/components/Character/TraceTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import API from "@/server/typedEndpoints";
import Image from "next/image";
import { TraceSummaryWrapper } from "./TraceSummaryWrapper";
import { SignatureLightCone } from "./SignatureLightCone";

interface Props {
  params: { slug: string };
}

export default async function Character({ params }: Props) {
  const { slug } = params;
  const characterId = parseInt(slug);
  const character = await API.mhyCharacter.fetch({
    params: `${characterId}`,
  });
  const { list: skills } = await API.mhySkill.fetch({
    params: `${characterId}`,
  });

  return (
    <>
      <div className="aspect-square">
        <Image
          src={portraitUrl(characterId)}
          width={2048}
          height={2048}
          className="place-self-start object-contain"
          alt={character.name}
        />
      </div>

      <div className="flex w-full grow flex-col">
        <Tabs defaultValue="skill">
          <TabsList>
            <TabsTrigger value="skill">Skills</TabsTrigger>
            <TabsTrigger value="eidolon">Eidolons</TabsTrigger>
            <TabsTrigger value="sig-lc">Signature Light Cone</TabsTrigger>
            <TabsTrigger value="trace">Traces</TabsTrigger>
          </TabsList>
          <TabsContent value="skill">
            <SkillOverview
              skills={skills}
              characterId={characterId}
              maxEnergy={character.max_sp}
            />
          </TabsContent>

          <TabsContent value="eidolon">
            <EidolonTable characterId={characterId} />
          </TabsContent>

          <TabsContent value="sig-lc">
            <SignatureLightCone characterId={characterId} />
          </TabsContent>

          <TabsContent value="trace">
            <div className="mt-2 flex flex-col items-center gap-4 xl:flex-row xl:items-start">
              <div className="flex w-[30rem] grow justify-center">
                <TraceTable
                  characterId={characterId}
                  wrapperSize={480}
                  path={character.path}
                  maxEnergy={character.max_sp}
                />
              </div>

              <div className="w-full">
                <TraceSummaryWrapper characterId={characterId} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function portraitUrl(charId: number | string): string {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/image/character_portrait/${charId}.png`;
}
