import ENDPOINT from "@/server/endpoints";
import * as z from 'zod';

export const defaultGachaQuery: z.infer<typeof ENDPOINT.probabilityRate.payload> = {
  currentEidolon: -1,
  pity: 0,
  pulls: 0,
  nextGuaranteed: false,
  enpitomizedPity: null,
  banner: "SSR",
};