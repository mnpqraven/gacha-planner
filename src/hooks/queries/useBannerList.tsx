import { PatchBanner } from "@/app/api/patch_banners/route";
import { List } from "@/lib/generics";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<List<PatchBanner>, unknown, PatchBanner[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;
export function useBannerList(opt: Options = {}) {
  const query = useQuery({
    queryKey: ["bannerList"],
    queryFn: async () => {
      const res = await fetch("/api/patch_banners");
      if (res.ok) {
        return res.json() as Promise<List<PatchBanner>>;
      } else {
        console.error("api fetch failed, code:", res.status);
        return Promise.reject(`unknown error ${res.text()}`);
      }
    },
    select: (data) => data.list,
    initialData: { list: [] },
    ...opt,
  });

  return { bannerList: query.data };
}
