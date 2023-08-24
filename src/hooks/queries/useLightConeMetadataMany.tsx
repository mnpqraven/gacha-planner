import { EquipmentConfig } from "@/bindings/EquipmentConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

export const optionsLightConeMetadataMany = (lightConeIds: number[]) =>
  queryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>({
    queryKey: ["lightConeMetadata", lightConeIds],
    queryFn: async () =>
      await API.lightConeMetadataMany.post({ payload: { list: lightConeIds } }),
    select: (data) => data.list,
  });

type Options = Omit<
  UseQueryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>,
  "queryKey" | "queryFn"
>;
export function useLightConeMetadataMany(
  lightConeIds: number[],
  opt: Options = {}
) {
  const query = useQuery({
    ...optionsLightConeMetadataMany(lightConeIds),
    ...opt,
  });

  return { lightCone: query.data };
}
