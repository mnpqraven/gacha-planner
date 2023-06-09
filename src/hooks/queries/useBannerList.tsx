import ENDPOINT from "@/server/endpoints";
import { workerFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";

export type Banner = z.infer<
  (typeof ENDPOINT)["gachaBannerList"]["response"]
>["banners"][number];

export const defaultBanner: Banner = {
  bannerName: "5* Banner character",
  banner: 0.5,
  guaranteed: 1.0,
  guaranteedPity: null,
  minConst: -1,
  maxConst: 6,
  maxPity: 90,
  constPrefix: "Eidolon",
  bannerType: "SSR",
};

export const useBannerList = () => {
  const { data } = useQuery({
    queryKey: ["gachaBannerList"],
    queryFn: async () => await workerFetch(ENDPOINT.gachaBannerList),
    initialData: { banners: [defaultBanner] },
  });

  return { bannerList: data?.banners ?? [] };
};
