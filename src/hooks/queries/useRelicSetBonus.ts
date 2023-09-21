import { RelicSetSkillConfig } from "@/bindings/RelicSetSkillConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const optionsRelicSetBonuses = () =>
  queryOptions<List<RelicSetSkillConfig>, unknown, RelicSetSkillConfig[]>({
    queryKey: ["relic_bonus"],
    queryFn: async () => await API.relicSetBonuses.get(),
    select: (data) => data.list,
  });

export function useRelicSetBonuses(opt: Options = {}) {
  const query = useQuery({
    ...optionsRelicSetBonuses(),
    ...opt,
  });

  return query;
}

export function useSuspendedRelicSets(opt: SuspendedOptions = {}) {
  const query = useSuspenseQuery({
    ...optionsRelicSetBonuses(),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<List<RelicSetSkillConfig>, unknown, RelicSetSkillConfig[]>,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<
    List<RelicSetSkillConfig>,
    unknown,
    RelicSetSkillConfig[]
  >,
  "queryKey" | "queryFn" | "select"
>;
