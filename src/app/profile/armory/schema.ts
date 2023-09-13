import * as z from "zod";

const ERR_RANGE = (from: number, to: number) =>
  `Please enter a number between ${from} and ${to}`;

const playerSchema = z
  .object({
    level: z
      .number()
      .min(1, { message: "Level must be greater than 1" })
      .max(80, { message: "Level must be less than 80" })
      .or(z.string())
      .pipe(z.coerce.number().min(1).max(80)),
    ascension: z
      .number()
      .min(0, { message: "Ascension must be greater than 0" })
      .max(6, { message: "Ascension must be less than 6" })
      .or(z.string())
      .pipe(z.coerce.number().min(0).max(6)),
    skills: z.record(
      z.number().or(z.string()).pipe(z.coerce.number()),
      z.number().or(z.string()).pipe(z.coerce.number().min(1).max(15))
    ),
    eidolon: z
      .number()
      .min(0, { message: "Eidolon must be greater than 0" })
      .max(6, { message: "Eidolon must be less than 6" })
      .or(z.string())
      .pipe(z.coerce.number().min(0).max(6)),
  })
  .refine((form) => form.level <= form.ascension * 10 + 20, {
    message: "Exceeded max level for given ascension",
  });

const lcSchema = z
  .object({
    id: z.number(),
    level: z
      .number()
      .min(0)
      .max(80)
      .or(z.string())
      .pipe(z.coerce.number().min(0).max(80)),
    ascension: z
      .number()
      .min(0, { message: ERR_RANGE(0, 6) })
      .max(6, { message: ERR_RANGE(0, 6) })
      .or(z.string())
      .pipe(
        z.coerce
          .number()
          .min(0, { message: ERR_RANGE(0, 6) })
          .max(6, { message: ERR_RANGE(0, 6) })
      ),
    imposition: z
      .number()
      .min(1, { message: ERR_RANGE(1, 5) })
      .max(5, { message: ERR_RANGE(1, 5) })
      .or(z.string())
      .pipe(
        z.coerce
          .number()
          .min(1, { message: ERR_RANGE(1, 5) })
          .max(5, { message: ERR_RANGE(1, 5) })
      ),
  })
  .nullable();

const propertySchema = z.object({
  setId: z
    .number()
    .nullish()
    .or(z.string().nullish())
    .pipe(z.coerce.string().nullish()),
  mainStat: z
    .object({
      key: z.string(),
      // NOTE: likely not needing this
      // value: z.number(),
      step: z
        .number()
        .min(0, { message: ERR_RANGE(0, 15) })
        .max(15, { message: ERR_RANGE(0, 15) })
        .or(z.string())
        .pipe(
          z.coerce
            .number()
            .min(0, { message: ERR_RANGE(0, 15) })
            .max(15, { message: ERR_RANGE(0, 15) })
        ),
    })
    .nullish(),
  subStats: z
    .array(
      z.object({
        key: z.string(),
        value: z.number(),
        step: z
          .number()
          .min(1, { message: ERR_RANGE(1, 6) })
          .max(6, { message: ERR_RANGE(1, 6) })
          .or(z.string())
          .pipe(
            z.coerce
              .number()
              .min(1, { message: ERR_RANGE(1, 6) })
              .max(6, { message: ERR_RANGE(1, 6) })
          ),
      })
    )
    .optional(),
});

export type RelicCategory =
  | "HEAD"
  | "HAND"
  | "BODY"
  | "FOOT"
  | "OBJECT"
  | "NECK";
export const relicCategories = [
  "HEAD",
  "HAND",
  "BODY",
  "FOOT",
  "OBJECT",
  "NECK",
] as const;
const relicSchema = z
  .record(z.enum(relicCategories), propertySchema)
  .nullable();

const formConfigSchema = z.object({ mounted: z.boolean() });

export const characterMetadataSchema = z
  .object({
    player: playerSchema,
    lc: lcSchema,
    relic: relicSchema,
    formConfig: formConfigSchema,
  })
  .refine((form) => form.player.level <= form.player.ascension * 10 + 20, {
    message: "Exceeded max level for given ascension",
  });

export type ArmoryFormSchema = z.infer<typeof characterMetadataSchema>;

export const defaultArmoryFormSchema: ArmoryFormSchema = {
  player: {
    level: 1,
    ascension: 0,
    eidolon: 0,
    skills: {},
  },
  relic: {},
  lc: null,
  formConfig: {
    mounted: false,
  },
};
