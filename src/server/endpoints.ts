import { BattlePassType, EqTier } from "@grpc/jadeestimate_pb";
import * as z from "zod";

const ENDPOINT = {
  jadeEstimate: {
    path: "/honkai/jade_estimate",
    payload: z.object({
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
      server: z.enum(["America", "Asia", "Europe"]),
      eq: z.nativeEnum(EqTier),
      moc: z.number().nonnegative(),
      mocCurrentWeekDone: z.boolean(),
      currentRolls: z.number().nonnegative(),
      currentJades: z.number().nonnegative(),
      dailyRefills: z.number().nonnegative(),
    }),
    response: z.object({
      sources: z
        .object({
          source: z.string(),
          jades_amount: z.number().nullable(),
          rolls_amount: z.number().nullable(),
          source_type: z.string(),
          description: z.string().nullable(),
        })
        .array(),
      total_jades: z.number(),
      rolls: z.number(),
      days: z.number(),
    }),
  },
  probabilityRate: {
    path: "/honkai/probability_rate",
    payload: z.object({
      currentEidolon: z.number(),
      pity: z.number().max(89, { message: "Pity count must be less than 90" }),
      pulls: z.number(),
      nextGuaranteed: z.boolean(),
      enpitomizedPity: z.number().nullable(),
      banner: z.enum(["SSR", "SR", "LC"]),
    }),
    response: z.object({
      roll_budget: z.number(),
      data: z
        .object({
          eidolon: z.number(),
          rate: z.number(),
        })
        .array()
        .array(),
    }),
  },
  listFuturePatchDate: {
    path: "/honkai/patch_dates",
    payload: undefined,
    response: z.object({
      list: z
        .object({
          name: z.string(),
          version: z.string(),
          dateStart: z.string().datetime(),
          date2ndBanner: z.string().datetime(),
          dateEnd: z.string().datetime(),
        })
        .array(),
    }),
  },
  listFuturePatchBanner: {
    path: "/honkai/patch_banners",
    payload: undefined,
    response: z.object({
      list: z
        .object({
          characterName: z.string(),
          icon: z.string().nullable(),
          element: z
            .enum([
              "Fire",
              "Ice",
              "Physical",
              "Wind",
              "Lightning",
              "Quantum",
              "Imaginary",
            ])
            .nullable(),
          elementColor: z.string().nullable(),
          version: z.string(),
          dateStart: z.string().datetime(),
          dateEnd: z.string().datetime(),
        })
        .array(),
    }),
  },
  gachaBannerList: {
    path: "/honkai/warp_banners",
    payload: undefined,
    response: z.object({
      list: z.array(
        z.object({
          bannerName: z.string(),
          banner: z.number(),
          guaranteed: z.number(),
          guaranteedPity: z.number().nullable(),
          minConst: z.number(),
          maxConst: z.number(),
          maxPity: z.number(),
          constPrefix: z.string(),
          constShorthand: z.string().length(1),
          bannerType: z.enum(["SSR", "SR", "LC"]),
        })
      ),
    }),
  },
  mhyCharacter: {
    path: "/honkai/mhy/character", // :id
    payload: undefined,
    response: z.any(),
  },
  mhyTrace: {
    path: "/honkai/mhy/trace", // :id
    payload: undefined,
    response: z.any(),
  },
  mhyBigTrace: {
    path: "/honkai/mhy/big_trace",
    payload: undefined,
    response: z.any(),
  },
  mhyEidolon: {
    path: "/honkai/mhy/eidolon", // :id
    payload: undefined,
    response: z.any(),
  },
  mhySimpleSkill: {
    path: "/honkai/mhy/skill", // :id
    payload: undefined,
    response: z.any(),
  },
  mhyAttributeProperty: {
    path: "/honkai/mhy/attribute_property_list", // :id
    payload: undefined,
    response: z.any(),
  },
} as const;
export type EndpointUrl = (typeof ENDPOINT)[keyof typeof ENDPOINT]["path"];

export const IMAGE_URL =
  "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/";

export default ENDPOINT;
