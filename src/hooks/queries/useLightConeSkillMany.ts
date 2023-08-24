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

export const optionsLightConeSkillMany = (ids: number[]) =>
  queryOptions<List<EquipmentSkillConfig>, unknown, EquipmentSkillConfig[]>({
    queryKey: ["lightConeSkill", ids],
    queryFn: async () =>
      await API.lightConeSkillMany.post({ payload: { list: ids } }),
    select: (data) => data.list,
  });

export function useLightConeSkillMany(
  lightConeIds: number[] | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsLightConeSkillMany(lightConeIds ?? []),
    enabled: !!lightConeIds,
    ...opt,
  });
  return query;
}

export function useSuspendedLightConeSkillMany(
  lightConeIds: number[],
  opt: SuspendedOptions = {}
) {
  const query = useSuspenseQuery({
    ...optionsLightConeSkillMany(lightConeIds),
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
