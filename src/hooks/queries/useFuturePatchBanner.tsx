import { PatchBanner } from "@/bindings/PatchBanner";
import { List } from "@/lib/generics";
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

const BASE = new Date("2023-07-19T02:00:00Z");
export const useFuturePatchBannerList2 = () => {
  const futurePatchBannerList: List<PatchBanner> = { list: [] };

  return { futurePatchBannerList };
};
