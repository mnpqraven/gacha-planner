import { EquipmentSkillConfig } from "@/bindings/EquipmentSkillConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<EquipmentSkillConfig, unknown, EquipmentSkillConfig>,
  "queryKey" | "queryFn" | "enabled"
>;
export function useLightConeSkill(
  lightConeId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    queryKey: ["lightConeSkill", lightConeId],
    queryFn: async () => await API.lightConeSkill.get({ lcId: lightConeId! }),
    enabled: !!lightConeId,
    ...opt,
  });
  return query;
}
