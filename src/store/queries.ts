import { optionsMainStatSpread } from "@/hooks/queries/useMainStatSpread";
import { optionsSubStatSpread } from "@/hooks/queries/useSubStatSpread";
import { atomsWithQuery } from "jotai-tanstack-query";

// needs suspense
export const [mainstatSpreadAtom] = atomsWithQuery((_get) =>
  optionsMainStatSpread()
);

export const [substatSpreadAtom] = atomsWithQuery((_get) =>
  optionsSubStatSpread()
);

mainstatSpreadAtom.debugLabel = "mainstatSpreadAtom";
substatSpreadAtom.debugLabel = "substatSpreadAtom";
