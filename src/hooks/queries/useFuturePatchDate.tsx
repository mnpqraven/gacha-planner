import { Patch } from "@/bindings/Patch";
import ENDPOINT from "@/server/endpoints";
import { typedFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";

export const useFuturePatchDateList = () => {
  const { data: futurePatchDateList } = useQuery({
    queryKey: ["futurePatchDateList"],
    queryFn: async () =>
      await typedFetch<undefined, { list: Patch[] }>(
        ENDPOINT.listFuturePatchDate
      ),
    initialData: { list: [] },
  });

  return { futurePatchDateList };
};
