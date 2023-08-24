import { AvatarPromotionConfig } from "@/bindings/AvatarPromotionConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<AvatarPromotionConfig, unknown, AvatarPromotionConfig>,
  "enabled" | "queryKey" | "queryFn"
>;

export function useCharacterPromotion(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    queryKey: ["promotion", characterId],
    queryFn: async () => await API.promotion.get(characterId),
    enabled: !!characterId,
    ...opt,
  });
  return { promotion: query.data };
}
