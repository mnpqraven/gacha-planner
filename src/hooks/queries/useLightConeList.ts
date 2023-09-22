import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export const useLightConeList = () => {
  const query = useQuery({
    queryKey: ["lightconeList"],
    queryFn: async () => await API.lightConeMetadataMany.get(),
    select: (data) => data.list,
    initialData: { list: [] },
  });
  return query;
};
