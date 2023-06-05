import ENDPOINT from "@/server/endpoints";
import { workerFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";

export type Banner = z.infer<
  (typeof ENDPOINT)["gachaBannerList"]["response"]
>[number];

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
  const { data: bannerList } = useQuery({
    queryKey: ["bannerList"],
    queryFn: async () => await workerFetch(ENDPOINT.gachaBannerList),
    initialData: [defaultBanner],
  });

  return { bannerList };
};
