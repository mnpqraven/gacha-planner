import { atom } from "jotai";

type LcSchema = {
  id: number | undefined;
  level: number;
  ascension: number;
  imposition: number;
};
export const lcIdAtom = atom<number | undefined>(undefined);

export const lcLevelAtom = atom(1);

export const lcPromotionAtom = atom(0);

export const lcImpositionAtom = atom(1);

export const maxLevelAtom = atom((get) => get(lcPromotionAtom) * 10 + 20);

export const lcStructAtom = atom(
  (get) => ({
    id: get(lcIdAtom),
    level: get(lcLevelAtom),
    ascension: get(lcPromotionAtom),
    imposition: get(lcImpositionAtom),
  }),
  (_get, set, next: LcSchema) => {
    set(lcIdAtom, next.id);
    set(lcLevelAtom, next.level);
    set(lcPromotionAtom, next.ascension);
    set(lcImpositionAtom, next.imposition);
  }
);
