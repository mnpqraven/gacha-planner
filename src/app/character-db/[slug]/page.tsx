import {
  EidolonTable,
  LoadingEidolonTable,
} from "@/app/components/Character/EidolonTable";
import {
  SkillOverview,
  SkillOverviewLoading,
} from "@/app/components/Character/SkillOverview";
import { TraceTable } from "@/app/components/Character/TraceTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import API from "@/server/typedEndpoints";
import { TraceSummaryWrapper } from "./TraceSummaryWrapper";
import { SignatureLightCone } from "./SignatureLightCone";
import { Suspense } from "react";
import Loading from "./loading";

interface Props {
  params: { slug: string };
}

export default async function Character({ params }: Props) {
  const { slug } = params;
  const characterId = parseInt(slug);
  const character = await API.character.get(characterId);
  const { list: skills } = await API.skillsByCharId.get(characterId);

  return (
    <Tabs defaultValue="skill">
      <TabsList className="h-fit [&>*]:whitespace-pre-wrap">
        <TabsTrigger value="skill">Skills</TabsTrigger>
        <TabsTrigger value="eidolon">Eidolons</TabsTrigger>
        <TabsTrigger value="sig-lc">Signature Light Cone</TabsTrigger>
        <TabsTrigger value="trace">Traces</TabsTrigger>
      </TabsList>

      <TabsContent value="skill">
        <Suspense fallback={<SkillOverviewLoading />}>
          <SkillOverview
            skills={skills}
            characterId={characterId}
            maxEnergy={character.spneed}
          />
        </Suspense>
      </TabsContent>

      <TabsContent value="eidolon">
        <Suspense fallback={<LoadingEidolonTable />}>
          <EidolonTable characterId={characterId} />
        </Suspense>
      </TabsContent>

      <TabsContent value="sig-lc">
        <Suspense fallback={<Loading />}>
          <SignatureLightCone characterId={characterId} />
        </Suspense>
      </TabsContent>

      <TabsContent value="trace">
        <div className="mt-2 flex flex-col items-center gap-4 xl:flex-row xl:items-start">
          <div className="flex w-[30rem] grow justify-center">
            <TraceTable
              characterId={characterId}
              wrapperSize={480}
              path={character.avatar_base_type}
              maxEnergy={character.spneed}
            />
          </div>

          <div className="w-full">
            <TraceSummaryWrapper characterId={characterId} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
