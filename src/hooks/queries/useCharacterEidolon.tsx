import { AvatarRankConfig } from "@/bindings/AvatarRankConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<List<AvatarRankConfig>, unknown, AvatarRankConfig[]>,
  "initialData"
>;

export function useCharacterEidolon(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    queryKey: ["eidolon", characterId],
    queryFn: async () => await API.eidolon.get(characterId),
    enabled: !!characterId,
    select: (data) => data.list,
    initialData: { list: [] },
    ...opt,
  });
  return { eidolons: query.data };
}
