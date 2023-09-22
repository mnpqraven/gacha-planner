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

export const optionsLightConeList = () =>
  queryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>({
    queryKey: ["lightconeList"],
    queryFn: async () => await API.lightConeMetadataMany.get(),
    select: (data) =>
      data.list.sort(
        (a, b) =>
          b.rarity - a.rarity ||
          a.equipment_name.localeCompare(b.equipment_name)
      ),
    initialData: { list: [] },
  });

export const useLightConeList = (opt: Options = {}) => {
  const query = useQuery({
    ...optionsLightConeList(),
    ...opt,
  });
  return query;
};

export const useSuspendedLightConeList = (opt: SuspendedOptions = {}) => {
  const query = useSuspenseQuery({
    ...optionsLightConeList(),
    ...opt,
  });
  return query;
};

type Options = Omit<
  UseQueryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>,
  "queryKey" | "queryFn" | "initialData" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<List<EquipmentConfig>, unknown, EquipmentConfig[]>,
  "queryKey" | "queryFn" | "initialData" | "select"
>;
