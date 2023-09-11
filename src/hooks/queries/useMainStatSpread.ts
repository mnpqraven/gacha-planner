import { RelicCategory } from "@/app/profile/armory/schema";
import { RelicMainAffixConfig } from "@/bindings/RelicMainAffixConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

export const optionsMainStatSpread = () =>
  queryOptions<
    Record<RelicCategory, RelicMainAffixConfig[]>,
    unknown,
    Record<RelicCategory, RelicMainAffixConfig[]>
  >({
    queryKey: ["statspread_main"],
    queryFn: async () => await API.mainstatSpread.get(),
  });

export function useMainStatSpread(opt: Options = {}) {
  const query = useQuery({
    ...optionsMainStatSpread(),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<
    Record<RelicCategory, RelicMainAffixConfig[]>,
    unknown,
    Record<RelicCategory, RelicMainAffixConfig[]>
  >,
  "queryKey" | "queryFn"
>;
