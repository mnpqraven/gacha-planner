import { EquipmentSkillConfig } from "@/bindings/EquipmentSkillConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const optionsLightConeSkills = (lcIds: number[] | undefined) =>
  queryOptions<List<EquipmentSkillConfig>, unknown, EquipmentSkillConfig[]>({
    queryKey: ["lightConeSkill", lcIds],
    queryFn: async () => await API.lightConeSkillMany.post({ list: lcIds! }),
    select: (data) => data.list,
    enabled: !!lcIds,
  });

export function useLightConeSkills(
  lightConeIds: number[] | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsLightConeSkills(lightConeIds),
    ...opt,
  });
  return query;
}

export function useSuspendedLightConeSkills(
  lightConeIds: number[],
  opt: SuspendedOptions = {}
) {
  const query = useSuspenseQuery({
    ...optionsLightConeSkills(lightConeIds),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<List<EquipmentSkillConfig>, unknown, EquipmentSkillConfig[]>,
  "queryKey" | "queryFn"
>;
type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<
    List<EquipmentSkillConfig>,
    unknown,
    EquipmentSkillConfig[]
  >,
  "queryKey" | "queryFn"
>;
