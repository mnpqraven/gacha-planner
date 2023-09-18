import { atom } from "jotai";
import { RelicCategory } from "../../armory/schema";
import { splitAtom } from "jotai/utils";
import { Property } from "@/bindings/SkillTreeConfig";

export interface RelicInput {
  id?: number;
  rarity: number;
  setId?: number; // diff ts
  type: RelicCategory;
  level: number;
  property?: Property; // diffts
  subStats: (SubStatSchema | undefined)[];
}

interface SubStatSchema {
  property: Property;
  value: number;
  step: number;
}

const initialRelicData: Pick<RelicInput, "level" | "subStats" | "rarity"> = {
  level: 0,
  subStats: [undefined, undefined, undefined, undefined],
  rarity: 5,
};
const initialRelicStruct: RelicInput[] = [
  { type: "HEAD", ...initialRelicData, property: "HPDelta" },
  { type: "HAND", ...initialRelicData, property: "AttackDelta" },
  { type: "BODY", ...initialRelicData },
  { type: "FOOT", ...initialRelicData },
  { type: "OBJECT", ...initialRelicData },
  { type: "NECK", ...initialRelicData },
];

export const relicsStructAtom = atom(initialRelicStruct);
export const splitRelicAtom = splitAtom(relicsStructAtom);

relicsStructAtom.debugLabel = "relicsAtom";
// splitRelicAtom.debugLabel = "splitRelicAtom";
