import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export const useLightConeList = () => {
  const { data: lightConeList } = useQuery({
    queryKey: ["lightconeList"],
    queryFn: async () => {
      const { list } = await API.lightConeMetadataMany.get();
      return list;
    },
    initialData: [],
  });
  return { lightConeList };
};
