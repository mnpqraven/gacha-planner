import { PatchBanner } from "@/app/api/patch_banners/route";
import { List } from "@/lib/generics";
import { useQuery } from "@tanstack/react-query";

export function useBannerList() {
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
    initialData: { list: [] },
  });

  return { bannerList: query.data.list };
}
