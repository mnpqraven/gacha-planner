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

export const optionsCharacterEidolon = (id: number | undefined) =>
  queryOptions<List<AvatarRankConfig>, unknown, AvatarRankConfig[]>({
    queryKey: ["eidolon", id],
    queryFn: async () => await API.eidolon.get(id),
    select: (data) => data.list,
  });

export function useCharacterEidolon(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsCharacterEidolon(characterId),
    ...opt,
  });
  return { eidolons: query.data };
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
