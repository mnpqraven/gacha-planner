import ENDPOINT from "@/server/endpoints";
import { workerFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";

export const useFuturePatchBannerList = () => {
  const { data: futurePatchBannerList } = useQuery({
    queryKey: ["futurePatchBannerList"],
    queryFn: async () => await workerFetch(ENDPOINT.listFuturePatchBanner),
    initialData: { banners: [] },
  });

  return { futurePatchBannerList };
};
