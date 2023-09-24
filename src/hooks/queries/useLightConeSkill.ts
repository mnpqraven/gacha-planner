import { EquipmentSkillConfig } from "@/bindings/EquipmentSkillConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

export const optionLightConeSkill = (lightConeId: number | undefined) =>
  queryOptions<EquipmentSkillConfig>({
    queryKey: ["lightConeSkill", lightConeId],
    queryFn: async () => await API.lightConeSkill.get({ lcId: lightConeId! }),
    enabled: !!lightConeId,
  });

export function useLightConeSkill(
  lightConeId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionLightConeSkill(lightConeId),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<EquipmentSkillConfig>,
  "queryKey" | "queryFn" | "enabled"
>;
