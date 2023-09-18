// TODO: rename file

import { atom } from "jotai";
import { relicsStructAtom } from "../_store/relic";
import { RefObject } from "react";

export const enkaRefAtom = atom<RefObject<HTMLDivElement> | undefined>(undefined);

export const mhyCharacterIds = atom<number[]>([]);
export const selectedCharacterIndexAtom = atom(0);
export const setIdsAtom = atom(
  (get) =>
    get(relicsStructAtom)
      .map((e) => e.setId)
      .filter(Boolean) as number[]
);
