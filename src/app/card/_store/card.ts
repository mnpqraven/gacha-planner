import { atom } from "jotai";
import { RefObject } from "react";
import { relicsStructAtom } from "./relic";

export const enkaRefAtom = atom<RefObject<HTMLDivElement> | undefined>(
  undefined
);

export const mhyCharacterIds = atom<number[]>([]);
export const selectedCharacterIndexAtom = atom(0);
export const setIdsAtom = atom(
  (get) =>
    get(relicsStructAtom)
      .map((e) => e.setId)
      .filter(Boolean) as number[]
);
