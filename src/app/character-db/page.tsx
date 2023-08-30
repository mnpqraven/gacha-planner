import API from "@/server/typedEndpoints";
import CharacterCatalogue from "./CharacterCatalogue";
import getQueryClient from "@/lib/queryClientHelper";
import { optionsCharacterList } from "@/hooks/queries/useCharacterList";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export const metadata = {
  title: "Character Database",
  description: "Honkai Star Rail Character Database",
};

export default async function CharacterDb() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(optionsCharacterList());
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="px-2 py-4 md:container md:px-0">
      <HydrationBoundary state={dehydratedState}>
        <CharacterCatalogue />
      </HydrationBoundary>
    </main>
  );
}
