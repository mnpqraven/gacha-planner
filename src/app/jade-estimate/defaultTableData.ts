import ENDPOINT from "@/server/endpoints";
import { PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import {
  JadeEstimateResponse,
  RewardFrequency,
  RewardSource,
} from "@grpc/jadeestimate_pb";
import * as z from "zod";

// export const placeholderTableData: z.infer<typeof ENDPOINT['jadeEstimate']['response']> = {
//   days: 0,
//   rolls: 0,
//   total_jades: 0,
//   sources: [
//     { source: "Simulated Universe", description: null, jades_amount: 0, rolls_amount: null, source_type: 'Weekly' },
//     { source: "Nameless Honor", description: null, jades_amount: 0, rolls_amount: null, source_type: 'WholePatch' },
//     { source: "Rail Pass", description: null, jades_amount: 0, rolls_amount: null, source_type: 'Monthly' },
//     { source: "Daily missions", description: null, jades_amount: 0, rolls_amount: null, source_type: 'Daily' },
//     { source: "Daily text messages", description: 'These text messeages are limited, you can run out of messages and you might get less in-game.', jades_amount: 0, rolls_amount: null, source_type: 'Daily' },
//     { source: "HoyoLab Check-in", description: '20 jades are distributed at the 5th, 13th and 20th every month.', jades_amount: 0, rolls_amount: null, source_type: 'Monthly' },
//     { source: "Character Trials", description: null, jades_amount: 0, rolls_amount: null, source_type: 'HalfPatch' },
//     { source: "Monthly ember exchange", description: null, jades_amount: null, rolls_amount: 0, source_type: 'Monthly' },
//   ],
// }

export const placeholderTableData: PlainMessage<JadeEstimateResponse> = {
  days: 0,
  rolls: 0,
  totalJades: 0,
  sources: [
    {
      source: "Simulated Universe",
      description: undefined,
      jadesAmount: 0,
      rollsAmount: undefined,
      sourceType: RewardFrequency.Weekly,
    },
    {
      source: "Nameless Honor",
      description: undefined,
      jadesAmount: 0,
      rollsAmount: undefined,
      sourceType: RewardFrequency.WholePatch,
    },
    {
      source: "Rail Pass",
      description: undefined,
      jadesAmount: 0,
      rollsAmount: undefined,
      sourceType: RewardFrequency.Monthly,
    },
    {
      source: "Daily missions",
      description: undefined,
      jadesAmount: 0,
      rollsAmount: undefined,
      sourceType: RewardFrequency.Daily,
    },
    {
      source: "Daily text messages",
      description:
        "These text messeages are limited, you can run out of messages and you might get less in-game.",
      jadesAmount: 0,
      rollsAmount: undefined,
      sourceType: RewardFrequency.Daily,
    },
    {
      source: "HoyoLab Check-in",
      description:
        "20 jades are distributed at the 5th, 13th and 20th every month.",
      jadesAmount: 0,
      rollsAmount: undefined,
      sourceType: RewardFrequency.Monthly,
    },
    {
      source: "Character Trials",
      description: undefined,
      jadesAmount: 0,
      rollsAmount: undefined,
      sourceType: RewardFrequency.HalfPatch,
    },
    {
      source: "Monthly ember exchange",
      description: undefined,
      jadesAmount: undefined,
      rollsAmount: 0,
      sourceType: RewardFrequency.Monthly,
    },
  ],
};
