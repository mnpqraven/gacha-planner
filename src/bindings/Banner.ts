export type BannerType = "SSR" | "SR" | "LC";

export interface Banner {
  banner: number;
  bannerName: string;
  bannerType: BannerType;
  constPrefix: string;
  constShorthand: string;
  guaranteed: number;
  guaranteedPity?: number | null;
  maxConst: number;
  maxPity: number;
  minConst: number;
  rarity: number;
}