import { AvatarRankConfig } from "@/bindings/AvatarRankConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseSuspenseQueryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

type Options = Omit<
  UseSuspenseQueryOptions<List<AvatarRankConfig>, unknown, AvatarRankConfig[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;

export function useSuspendedCharacterEidolon(
  characterId: number,
  opt: Options = {}
) {
  const query = useSuspenseQuery({
    queryKey: ["eidolon", characterId],
    queryFn: async () => await API.eidolon.get(characterId),
    select: (data) => data.list,
    ...opt,
  });
  return { eidolons: query.data };
}

export function useCharacterEidolon(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    queryKey: ["eidolon", characterId],
    queryFn: async () => await API.eidolon.get(characterId),
    enabled: !!characterId,
    select: (data) => data.list,
    ...opt,
  });
  return { eidolons: query.data };
}
