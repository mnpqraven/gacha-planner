import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export function useCharacterPromotion(characterId: number | undefined) {
  const query = useQuery({
    queryKey: ["promotion", characterId],
    queryFn: async () => await API.promotion.get(characterId),
    enabled: !!characterId,
  });
  return { promotion: query.data };
}
