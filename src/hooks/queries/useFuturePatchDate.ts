import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export const useFuturePatchDateList = () => {
  const { data: futurePatchDateList } = useQuery({
    queryKey: ["patchDates"],
    queryFn: async () => await API.patchDates.get(),
    initialData: { list: [] },
  });

  return { futurePatchDateList };
};
