import { EquipmentSkillConfig } from "@/bindings/EquipmentSkillConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export function useLightConeSkill(
  lightConeId: number | undefined,
  opt: UseQueryOptions<EquipmentSkillConfig> = {}
) {
  const query = useQuery({
    queryKey: ["lightConeSkill", lightConeId],
    queryFn: async () => await API.lightConeSkill.get(lightConeId),
    enabled: !!lightConeId,
    ...opt,
  });
  return { skill: query.data };
}
