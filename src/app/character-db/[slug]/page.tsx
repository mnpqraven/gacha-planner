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
import API, { rpc } from "@/server/typedEndpoints";
import { TraceSummaryWrapper } from "./TraceSummaryWrapper";
import { SignatureLightCone } from "./SignatureLightCone";
import { Suspense } from "react";
import Loading from "./loading";
import getQueryClient from "@/lib/queryClientHelper";
import { SignatureAtlasService } from "@grpc/atlas_connect";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { optionsSignatureAtlas } from "@/hooks/queries/useSignatureAtlas";

interface Props {
  params: { slug: string };
}

export default async function Character({ params }: Props) {
  const { slug } = params;
  const characterId = parseInt(slug);
  const character = await API.character.get(characterId);

  const { list: signatureAtlas } = await rpc(SignatureAtlasService).list({});
  const lc_ids =
    signatureAtlas.find((e) => e.charId === characterId)?.lcId ?? [];

  // TODO:
  // hydration test
  // options refactor
  const queryClient = getQueryClient();
  const a = queryClient.prefetchQuery(optionsSignatureAtlas());
  // TODO: merge with useLightConeMetadataMany
  const b = queryClient.prefetchQuery({
    queryKey: ["lightconeMetadata", lc_ids],
    queryFn: async () =>
      await API.lightConeMetadataMany.post({
        payload: { list: lc_ids },
      }),
  });
  const c = queryClient.prefetchQuery({
    queryKey: ["lightconeSkill", lc_ids],
    queryFn: async () =>
      await API.lightConeSkillMany.post({
        payload: { list: lc_ids },
      }),
  });
  const d = queryClient.prefetchQuery({
    queryKey: ["eidolon", characterId],
    queryFn: async () => await API.eidolon.get(characterId),
  });

  await Promise.allSettled([a, b, c, d]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <Tabs defaultValue="skill">
      <TabsList className="h-fit [&>*]:whitespace-pre-wrap">
        <TabsTrigger value="skill">Skills</TabsTrigger>
        <TabsTrigger value="eidolon">Eidolons</TabsTrigger>
        <TabsTrigger value="sig-lc">Signature Light Cone</TabsTrigger>
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
      </HydrationBoundary>
    </Tabs>
  );
}
