import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export function useLightConePromotion(lightConeId: number | undefined) {
  const query = useQuery({
    queryKey: ["lightConePromotion", lightConeId],
    queryFn: async () => await API.lightConePromotion.get(lightConeId),
    enabled: !!lightConeId,
  });
  return { promotion: query.data };
}
