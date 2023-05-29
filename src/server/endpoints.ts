export const ENDPOINT = {
  jadeEstimate: "honkai/jade_estimate",
  probabilityRate: "honkai/probability_rate",
} as const;
export type EndpointValue = (typeof ENDPOINT)[keyof typeof ENDPOINT];
