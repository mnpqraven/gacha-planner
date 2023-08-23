import { AvatarRankConfig } from "@/bindings/AvatarRankConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseSuspenseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

type Options = Omit<
  UseSuspenseQueryOptions<List<AvatarRankConfig>, unknown, AvatarRankConfig[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;

export function useCharacterEidolon(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useSuspenseQuery({
    queryKey: ["eidolon", characterId],
    queryFn: async () => await API.eidolon.get(characterId),
    // enabled: !!characterId,
    select: (data) => data.list,
    initialData: { list: [] },
    ...opt,
  });
  return { eidolons: query.data };
}
