import { RelicConfig } from "@/bindings/RelicConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

export const optionsRelic = (setIds: number[] | undefined) =>
  queryOptions<List<RelicConfig>, unknown, RelicConfig[]>({
    queryKey: ["relics", setIds],
    queryFn: async () => await API.relics.post({ list: setIds! }),
    select: (data) => data.list.sort((a, b) => a.set_id - b.set_id),
    enabled: !!setIds,
  });

export function useRelics(setIds: number[] | undefined, opt: Options = {}) {
  const query = useQuery({
    ...optionsRelic(setIds),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<List<RelicConfig>, unknown, RelicConfig[]>,
  "queryKey" | "queryFn" | "select"
>;
