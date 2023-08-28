import { AvatarRankConfig } from "@/bindings/AvatarRankConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const optionsCharacterEidolon = (characterId: number) =>
  queryOptions<List<AvatarRankConfig>, unknown, AvatarRankConfig[]>({
    queryKey: ["eidolon", characterId],
    queryFn: async () => await API.eidolon.get({ characterId }),
    select: (data) => data.list,
  });

export function useCharacterEidolon(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsCharacterEidolon(characterId!),
    enabled: !!characterId,
    ...opt,
  });
  return query;
}

export function useSuspendedCharacterEidolon(
  characterId: number,
  opt: SuspenseOptions = {}
) {
  const query = useSuspenseQuery({
    ...optionsCharacterEidolon(characterId),
    ...opt,
  });
  return { eidolons: query.data };
}

type Options = Omit<
  UseQueryOptions<List<AvatarRankConfig>, unknown, AvatarRankConfig[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;
type SuspenseOptions = Omit<
  UseSuspenseQueryOptions<List<AvatarRankConfig>, unknown, AvatarRankConfig[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;
