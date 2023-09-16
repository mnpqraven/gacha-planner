import { RelicCategory } from "@/app/profile/armory/schema";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

export const optionsRelicSlotType = (setIds: number[] | undefined) =>
  queryOptions<
    Record<number, RelicCategory>,
    unknown,
    Record<number, RelicCategory>
  >({
    queryKey: ["relic_slot_type", setIds],
    queryFn: async () => await API.relicSlotType.post({ list: setIds ?? [] }),
  });

export function useRelicSlotType(
  setIds: number[] | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsRelicSlotType(setIds),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<
    Record<number, RelicCategory>,
    unknown,
    Record<number, RelicCategory>
  >,
  "queryKey" | "queryFn"
>;
