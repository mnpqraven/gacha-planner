import ENDPOINT from "@/server/endpoints";
import { workerFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";

export const useFuturePatchDateList = () => {
  const { data: futurePatchDateList } = useQuery({
    queryKey: ["futurePatchDateList"],
    queryFn: async () => await workerFetch(ENDPOINT.listFuturePatchDate),
    initialData: { list: [] },
  });

  return { futurePatchDateList };
};
