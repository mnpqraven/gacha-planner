import ENDPOINT from "@/server/endpoints";
import { workerFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";

export type Banner = z.infer<
  (typeof ENDPOINT)["gachaBannerList"]["response"]
>["list"][number];

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
};

export const useBannerList = () => {
  const { data } = useQuery({
    queryKey: ["gachaBannerList"],
    queryFn: async () => await workerFetch({ endpoint: ENDPOINT.gachaBannerList }),
    initialData: { list: [defaultBanner] },
  });

  return { bannerList: data?.list ?? [] };
};
