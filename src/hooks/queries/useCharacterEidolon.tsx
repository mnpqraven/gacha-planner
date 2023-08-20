import { AvatarRankConfig } from "@/bindings/AvatarRankConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export function useCharacterEidolon(
  characterId: number | undefined,
  opt: UseQueryOptions<List<AvatarRankConfig>> = {}
) {
  const query = useQuery({
    queryKey: ["eidolon", characterId],
    queryFn: async () => await API.eidolon.get(characterId),
    enabled: !!characterId,
    ...opt,
  });
  return { eidolons: query.data?.list };
}
