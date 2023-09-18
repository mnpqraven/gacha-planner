import { RelicSetConfig } from "@/bindings/RelicSetConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const optionsRelicSet = () =>
  queryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>({
    queryKey: ["relic_sets"],
    queryFn: async () => await API.relicSets.get(),
    select: (data) => data.list.sort((a, b) => a.set_id - b.set_id),
  });

export function useRelicSets(opt: Options = {}) {
  const query = useQuery({
    ...optionsRelicSet(),
    ...opt,
  });

  return query;
}

export function useSuspendedRelicSets(opt: SuspendedOptions = {}) {
  const query = useSuspenseQuery({
    ...optionsRelicSet(),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>,
  "queryKey" | "queryFn" | "select"
>;

export const optionRelicSet = (setId: number | undefined) =>
  queryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>({
    queryKey: ["relic_set", setId],
    queryFn: async () => await API.relicSet.get({ relicSetId: setId! }),
    select: (data) => data.list.sort((a, b) => a.set_id - b.set_id),
    enabled: !!setId,
  });

export function useRelicSet(setId: number | undefined, opt: Option = {}) {
  const query = useQuery({
    ...optionRelicSet(setId),
    ...opt,
  });

  return query;
}
type Option = Omit<
  UseQueryOptions<List<RelicSetConfig>, unknown, RelicSetConfig[]>,
  "queryKey" | "queryFn" | "select"
>;
