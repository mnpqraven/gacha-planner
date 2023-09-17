import API from "@/server/typedEndpoints";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { atomsWithQuery } from "jotai-tanstack-query";
import { selectAtom } from "jotai/utils";

export const charIdAtom = atom<number | undefined>(undefined);

export const charLevelAtom = atom(1);

export const charPromotionAtom = atom(0);

export const charEidAtom = atom(0);

export const charSkillAtom = atomWithImmer<Record<string, number>>({});

export const charTraceAtom = atom({});

export const maxLevelAtom = atom((get) => get(charPromotionAtom) * 10 + 20);

export const charStructAtom = atom((get) => ({
  id: get(charIdAtom),
  level: get(charLevelAtom),
  ascension: get(charPromotionAtom),
  eidolon: get(charEidAtom),
  trace: get(charTraceAtom),
  skills: get(charSkillAtom),
}));


charIdAtom.debugLabel = "charIdAtom";
charLevelAtom.debugLabel = "charLevelAtom";
charPromotionAtom.debugLabel = "charPromotionAtom";
charEidAtom.debugLabel = "charEidAtom";
charSkillAtom.debugLabel = "charSkillAtom";
charTraceAtom.debugLabel = "charTraceAtom";
maxLevelAtom.debugLabel = "maxLevelAtom";
charStructAtom.debugLabel = "charStructAtom";
