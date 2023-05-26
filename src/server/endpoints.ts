export const ENDPOINT = {
  gachaCfg: "honkai/gacha_cfg",
  probabilityRate: "honkai/probability_rate",
} as const;
export type EndpointValue = (typeof ENDPOINT)[keyof typeof ENDPOINT];
