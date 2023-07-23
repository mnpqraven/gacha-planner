import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export const useFuturePatchBannerList = () => {
  const { data: futurePatchBannerList } = useQuery({
    queryKey: ["futurePatchBannerList"],
    queryFn: async () => await API.patchBanners.get(),
    initialData: { list: [] },
  });

  return { futurePatchBannerList };
};
