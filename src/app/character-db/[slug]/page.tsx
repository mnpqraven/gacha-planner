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
import { TraceSummaryWrapper } from "./TraceSummaryWrapper";
import { SignatureLightCone } from "./SignatureLightCone";
import { Suspense } from "react";
import getQueryClient from "@/lib/queryClientHelper";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { optionsCharacterEidolon } from "@/hooks/queries/useCharacterEidolon";
import { optionsCharacterTrace } from "@/hooks/queries/useCharacterTrace";
import { optionsProperties } from "@/hooks/queries/useProperties";
import Loading from "./loading";

interface Props {
  params: { slug: string };
}

export default async function Character({ params }: Props) {
  const characterId = parseInt(params.slug);
  const dehydratedState = await prefetchOptions(characterId);

  return (
    <Tabs defaultValue="skill">
      <TabsList className="h-fit [&>*]:whitespace-pre-wrap">
        <TabsTrigger value="skill">Skills</TabsTrigger>
        <TabsTrigger value="eidolon">Eidolons</TabsTrigger>
        <TabsTrigger value="sig-lc">Featured Light Cone</TabsTrigger>
        <TabsTrigger value="trace">Traces</TabsTrigger>
      </TabsList>

      <HydrationBoundary state={dehydratedState}>
        <TabsContent value="skill">
          <Suspense fallback={<SkillOverviewLoading />}>
            <SkillOverview characterId={characterId} />
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
              <TraceTable characterId={characterId} wrapperSize={480} />
            </div>

            <div className="w-full">
              <TraceSummaryWrapper characterId={characterId} />
            </div>
          </div>
        </TabsContent>
      </HydrationBoundary>
    </Tabs>
  );
}

async function prefetchOptions(characterId: number) {
  const queryClient = getQueryClient();
  const options = [
    optionsCharacterEidolon(characterId),
    optionsCharacterTrace(characterId),
    optionsProperties(),
  ];
  await Promise.allSettled(
    options.map((option) => queryClient.prefetchQuery(option as any))
  );
  return dehydrate(queryClient);
}
