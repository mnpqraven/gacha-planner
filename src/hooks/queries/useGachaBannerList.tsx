import { Banner } from "@/bindings/Banner";
import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export const defaultBanner: Banner = {
  bannerName: "5* Banner character",
  banner: 0.5,
  guaranteed: 1.0,
  guaranteedPity: null,
  minConst: -1,
  maxConst: 6,
  maxPity: 90,
  constPrefix: "Eidolon",
  constShorthand: "E",
  bannerType: "SSR",
  rarity: 5,
};

export const useBannerList = () => {
  const query = useQuery({
    queryKey: ["gachaBannerList"],
    queryFn: async () => await API.warpBanner.get(),
    initialData: { list: [defaultBanner] },
    select: (data) => data.list,
  });

  return query;
};
