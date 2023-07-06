import { EidolonTable } from "@/app/components/Character/EidolonTable";
import { SkillOverview } from "@/app/components/Character/SkillOverview";
import { TraceSummary } from "@/app/components/Character/TraceSummary";
import { TraceTable } from "@/app/components/Character/TraceTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import API from "@/server/typedEndpoints";
import Image from "next/image";

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

      <div className="flex grow flex-col md:w-min">
        <Tabs defaultValue="skill">
          <TabsList>
            <TabsTrigger value="skill">Skills</TabsTrigger>
            <TabsTrigger value="eidolon">Eidolons</TabsTrigger>
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
        </Tabs>

        <div className="flex flex-col self-center">
          <TraceTable
            characterId={characterId}
            wrapperSize={480}
            path={character.path}
            maxEnergy={character.max_sp}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Total gain from traces</CardTitle>
          </CardHeader>
          <CardContent>
            <TraceSummary characterId={characterId} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function portraitUrl(charId: number | string): string {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/image/character_portrait/${charId}.png`;
}
