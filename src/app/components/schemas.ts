import * as z from "zod";

export const jadeEstimateFormSchema = z.object({
  server: z.enum(["Asia", "America"]),
  untilDate: z.object(
    {
      day: z.number(),
      month: z.number(),
      year: z.number(),
    },
    { required_error: "Required field" }
  ),
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
  eq: z.enum(["Zero", "One", "Two", "Three", "Four", "Five", "Six"]),
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
});

export const dateToISO = z.date().transform((e) => ({
  day: e.getDate(),
  month: e.getMonth() + 1,
  year: e.getUTCFullYear(),
}));
