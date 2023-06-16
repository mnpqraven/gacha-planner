import { PatchBanner } from "@/bindings/PatchBanner";
import { List } from "@/lib/generics";
import ENDPOINT from "@/server/endpoints";
import { typedFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";

export const useFuturePatchBannerList = () => {
  const { data: futurePatchBannerList } = useQuery({
    queryKey: ["futurePatchBannerList"],
    queryFn: async () =>
      await typedFetch<null, List<PatchBanner>>(
        ENDPOINT.listFuturePatchBanner
      ),
    initialData: { list: [] },
  });

  return { futurePatchBannerList };
};
