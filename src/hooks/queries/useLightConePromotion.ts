import { EquipmentPromotionConfig } from "@/bindings/EquipmentPromotionConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

export const optionLightConePromotion = (lcId: number | undefined) =>
  queryOptions<EquipmentPromotionConfig>({
    queryKey: ["lightConePromotion", lcId],
    queryFn: async () => await API.lightConePromotion.get({ lcId: lcId! }),
    enabled: !!lcId,
  });

export function useLightConePromotion(
  lcId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionLightConePromotion(lcId),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<EquipmentPromotionConfig>,
  "queryKey" | "queryFn" | "enabled"
>;
