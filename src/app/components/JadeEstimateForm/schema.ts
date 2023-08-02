import { BattlePassType, EqTier, Server } from "@grpc/jadeestimate_pb";
import * as z from "zod";

export const schema = z.object({
  untilDate: z.object(
    {
      day: z.number(),
      month: z.number(),
      year: z.number(),
    },
    { required_error: "Required field" }
  ),
  battlePass: z.object({
    battlePassType: z.nativeEnum(BattlePassType),
    currentLevel: z.number().nonnegative(),
  }),
  railPass: z.object({
    useRailPass: z.boolean(),
    daysLeft: z.number().nonnegative(),
  }),
  server: z.nativeEnum(Server),
  eq: z.nativeEnum(EqTier),
  moc: z.number().nonnegative(),
  mocCurrentWeekDone: z.boolean(),
  currentRolls: z.number().nonnegative(),
  currentJades: z.number().nonnegative(),
  dailyRefills: z.number().nonnegative(),
});
