import * as z from "zod";

export const ENV = {
  WORKER_API: process.env.NEXT_PUBLIC_WORKER_API,
};

const ENDPOINT = {
  jadeEstimate: {
    path: "/honkai/jade_estimate",
    payload: z.object({
      untilDate: z.date().transform((e) => ({
        day: e.getDate(),
        month: e.getMonth() + 1,
        year: e.getUTCFullYear(),
      })),
      battlePass: z.boolean(),
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
      eq: z.enum(['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six']),
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
      rolls: z.number(),
      nextGuaranteed: z.boolean(),
      simulateResult: z.boolean(),
    }),
    response: z.object({
      rolls: z.number(),
      rates: z
        .object({
          draw_number: z.number(),
          percent: z.number(),
          eidolon: z.number(),
        })
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
} as const;
export type EndpointValue = (typeof ENDPOINT)[keyof typeof ENDPOINT]["path"];

export default ENDPOINT