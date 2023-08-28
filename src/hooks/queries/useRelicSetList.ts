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
    queryKey: ["relic_set"],
    queryFn: async () => await API.relicSets.get(),
    select: (data) => data.list,
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
