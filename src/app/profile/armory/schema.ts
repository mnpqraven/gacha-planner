import * as z from "zod";

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
      z.string(),
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
      .min(0)
      .max(6)
      .or(z.string())
      .pipe(z.coerce.number().min(0).max(6)),
  })
  .nullable();

const propertySchema = z.object({
  setId: z.number().or(z.string()).pipe(z.coerce.string()),
  mainStat: z.object({ key: z.string(), value: z.number() }),
  subStats: z.array(z.object({ key: z.string(), value: z.number() })),
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

export const defaultValues: ArmoryFormSchema = {
  player: {
    level: 1,
    ascension: 0,
    eidolon: 0,
    skills: {},
  },
  relic: null,
  lc: null,
  formConfig: {
    mounted: false,
  },
};