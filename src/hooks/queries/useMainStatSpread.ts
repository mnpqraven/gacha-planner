import { RelicType } from "@/bindings/RelicConfig";
import { RelicMainAffixConfig } from "@/bindings/RelicMainAffixConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

export const optionsMainStatSpread = () =>
  queryOptions<
    Record<RelicType, RelicMainAffixConfig[]>,
    unknown,
    Record<RelicType, RelicMainAffixConfig[]>
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
    Record<RelicType, RelicMainAffixConfig[]>,
    unknown,
    Record<RelicType, RelicMainAffixConfig[]>
  >,
  "queryKey" | "queryFn"
>;
