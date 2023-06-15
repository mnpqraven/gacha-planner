import * as z from "zod";

export const dateToISO = z.date().transform((e) => ({
  day: e.getDate(),
  month: e.getMonth() + 1,
  year: e.getUTCFullYear(),
}));

export const objToDate = z.object({
  day: z.number(),
  month: z.number(),
  year: z.number()
}).transform((e) => new Date(e.year, e.month - 1, e.day));