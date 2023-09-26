import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

type CharacterSchema = {
  id: number | undefined;
  level: number;
  ascension: number;
  eidolon: number;
  trace: Record<string | number, boolean>;
  skills: Record<string, number>;
};
export const charIdAtom = atom<number | undefined>(undefined);

export const charLevelAtom = atom(1);

export const charPromotionAtom = atom(0);

export const charMaxLevelAtom = atom((get) => get(charPromotionAtom) * 10 + 20);

export const charEidAtom = atom(0);

export const charSkillAtom = atomWithImmer<Record<string, number>>({});

export const charTraceAtom = atomWithImmer<Record<string | number, boolean>>(
  {}
);

export const updateManyCharTraceAtom = atom(
  null,
  (_, set, payload: { id: number | string; checked: boolean }[]) => {
    set(charTraceAtom, (draft) => {
      payload.forEach(({ id, checked }) => {
        draft[id] = checked;
      });
    });
  }
);

export const maxLevelAtom = atom((get) => get(charPromotionAtom) * 10 + 20);

export const charStructAtom = atom(
  (get) => ({
    id: get(charIdAtom),
    level: get(charLevelAtom),
    ascension: get(charPromotionAtom),
    eidolon: get(charEidAtom),
    trace: get(charTraceAtom),
    skills: get(charSkillAtom),
  }),
  (_get, set, next: CharacterSchema) => {
    set(charIdAtom, next.id);
    set(charLevelAtom, next.level);
    set(charPromotionAtom, next.ascension);
    set(charEidAtom, next.eidolon);
    set(charTraceAtom, next.trace);
    set(charSkillAtom, next.skills);
  }
);
