import { atom } from "jotai";

export const lcIdAtom = atom<number | undefined>(undefined);

export const lcLevelAtom = atom(1);

export const lcPromotionAtom = atom(0);

export const lcImpositionAtom = atom(1);

export const maxLevelAtom = atom((get) => get(lcPromotionAtom) * 10 + 20);

export const lcStructAtom = atom((get) => ({
  id: get(lcIdAtom),
  level: get(lcLevelAtom),
  ascension: get(lcPromotionAtom),
  imposition: get(lcImpositionAtom),
}));

lcIdAtom.debugLabel = "lcIdAtom";
lcLevelAtom.debugLabel = "lcLevelAtom";
lcPromotionAtom.debugLabel = "lcPromotionAtom";
lcImpositionAtom.debugLabel = "lcImpositionAtom";
lcStructAtom.debugLabel = "lcStructAtom";
