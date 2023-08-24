import { PlainMessage } from "@bufbuild/protobuf";
import { JadeEstimateResponse, RewardFrequency } from "@grpc/jadeestimate_pb";

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
