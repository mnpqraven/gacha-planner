import { EquipmentConfig } from "@/bindings/EquipmentConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const optionsLightConeMetadataMany = (
  lightConeIds: number[] | undefined
) =>
  queryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>({
    queryKey: ["lightConeMetadata", lightConeIds],
    queryFn: async () =>
      await API.lightConeMetadataMany.post({ list: lightConeIds! }),
    select: (data) => data.list,
    enabled: !!lightConeIds,
  });

export function useLightConeMetadatas(
  lightConeIds: number[] | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsLightConeMetadataMany(lightConeIds),
    ...opt,
  });

  return query;
}

export function useSuspendedLightConeMetadataMany(
  lightConeIds: number[],
  opt: SuspendedOptions = {}
) {
  const query = useSuspenseQuery({
    ...optionsLightConeMetadataMany(lightConeIds),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>,
  "queryKey" | "queryFn"
>;
type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>,
  "queryKey" | "queryFn"
>;
