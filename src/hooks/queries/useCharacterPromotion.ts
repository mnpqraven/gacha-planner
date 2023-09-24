import { AvatarPromotionConfig } from "@/bindings/AvatarPromotionConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<AvatarPromotionConfig>,
  "enabled" | "queryKey" | "queryFn"
>;
export const optionCharacterPromotion = (charId: number | undefined) =>
  queryOptions<AvatarPromotionConfig>({
    queryKey: ["promotion", charId],
    queryFn: async () => await API.promotion.get({ characterId: charId! }),
    enabled: !!charId,
  });

export function useCharacterPromotion(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionCharacterPromotion(characterId),
    ...opt,
  });
  return query;
}
