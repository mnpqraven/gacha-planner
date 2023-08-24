import { SkillTreeConfig } from "@/bindings/SkillTreeConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

export const optionsCharacterTrace = (id: number | undefined) =>
  queryOptions<List<SkillTreeConfig>, unknown, SkillTreeConfig[]>({
    queryKey: ["trace", id],
    queryFn: async () => await API.trace.get(id),
    select: (data) => data.list,
  });

export function useCharacterTrace(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsCharacterTrace(characterId),
    enabled: !!characterId,
    ...opt,
  });
  return query;
}

export function useSuspendedCharacterTrace(
  characterId: number,
  opt: SuspendedOptions = {}
) {
  const query = useQuery({
    ...optionsCharacterTrace(characterId),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<List<SkillTreeConfig>, unknown, SkillTreeConfig[]>,
  "queryKey" | "queryFn" | "select" | "enabled"
>;
type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<List<SkillTreeConfig>, unknown, SkillTreeConfig[]>,
  "queryKey" | "queryFn" | "select"
>;
