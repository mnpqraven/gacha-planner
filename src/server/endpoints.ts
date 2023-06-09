import * as z from "zod";

const ENDPOINT = {
  jadeEstimate: {
    path: "/honkai/jade_estimate",
    payload: z.object({
      untilDate: z.date().transform((e) => ({
        day: e.getDate(),
        month: e.getMonth() + 1,
        year: e.getUTCFullYear(),
      })),
      battlePass: z.enum(["None", "Basic", "Premium"]),
      railPass: z.object({
        useRailPass: z.boolean(),
        daysLeft: z.preprocess(
          (args) => (args === "" ? undefined : args),
          z.coerce.number({
            invalid_type_error: "Must be a number",
            required_error: "Required field",
          })
        ),
      }),
      eq: z.enum(["Zero", "One", "Two", "Three", "Four", "Five", "Six"]),
      moc: z.preprocess(
        (args) => (args === "" ? undefined : args),
        z.coerce.number({
          invalid_type_error: "Must be a number",
          required_error: "Required field",
        })
      ),
      currentRolls: z.preprocess(
        (args) => (args === "" ? undefined : args),
        z.coerce
          .number({
            invalid_type_error: "Must be a number",
            required_error: "Required field",
          })
          .nonnegative()
          .optional()
      ),
      currentJades: z.preprocess(
        (args) => (args === "" ? undefined : args),
        z.coerce
          .number({
            invalid_type_error: "Must be a number",
            required_error: "Required field",
          })
          .nonnegative()
          .optional()
      ),
    }),
    response: z.object({
      sources: z
        .object({
          source: z.string(),
          jades_amount: z.number().nullable(),
          rolls_amount: z.number().nullable(),
          source_type: z.string(),
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
      pity: z.number(),
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
    path: "/honkai/list_future_patch_date",
    payload: undefined,
    response: z.object({
      patches: z
        .object({
          name: z.string(),
          version: z.string(),
          dateStart: z.string().datetime(),
          dateEnd: z.string().datetime(),
        })
        .array(),
    }),
  },
  gachaBannerList: {
    path: "/honkai/gacha_banner_list",
    payload: undefined,
    response: z.object({
      banners: z.array(
        z.object({
          bannerName: z.string(),
          banner: z.number(),
          guaranteed: z.number(),
          guaranteedPity: z.number().nullable(),
          minConst: z.number(),
          maxConst: z.number(),
          maxPity: z.number(),
          constPrefix: z.string(),
          bannerType: z.enum(["SSR", "SR", "LC"]),
        })
      ),
    }),
  },
} as const;
export type EndpointUrl = (typeof ENDPOINT)[keyof typeof ENDPOINT]["path"];

export default ENDPOINT;
