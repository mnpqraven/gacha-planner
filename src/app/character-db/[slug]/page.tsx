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
import getQueryClient from "@/lib/queryClientHelper";
import { SignatureAtlasService } from "@grpc/atlas_connect";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { optionsSignatureAtlas } from "@/hooks/queries/useSignatureAtlas";
import { optionsLightConeMetadataMany } from "@/hooks/queries/useLightConeMetadataMany";
import { optionsLightConeSkillMany } from "@/hooks/queries/useLightConeSkillMany";
import { optionsCharacterEidolon } from "@/hooks/queries/useCharacterEidolon";
import Loading from "./loading";
import { optionsCharacterTrace } from "@/hooks/queries/useCharacterTrace";
import { optionsProperties } from "@/hooks/queries/useProperties";

interface Props {
  params: { slug: string };
}

export default async function Character({ params }: Props) {
  const characterId = parseInt(params.slug);
  const character = await API.character.get({ characterId });
  const { list: signatureAtlas } = await rpc(SignatureAtlasService).list({});
  const lc_ids =
    signatureAtlas.find((e) => e.charId === characterId)?.lcId ?? [];

  const dehydratedState = await prefetchOptions(lc_ids, characterId);

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

async function prefetchOptions(lc_ids: number[], characterId: number) {
  const queryClient = getQueryClient();
  const options = [
    optionsSignatureAtlas(),
    optionsLightConeMetadataMany(lc_ids),
    optionsLightConeSkillMany(lc_ids),
    optionsCharacterEidolon(characterId),
    optionsCharacterTrace(characterId),
    optionsProperties(),
  ];
  await Promise.allSettled(
    options.map((option) => queryClient.prefetchQuery(option as any))
  );
  return dehydrate(queryClient);
}
