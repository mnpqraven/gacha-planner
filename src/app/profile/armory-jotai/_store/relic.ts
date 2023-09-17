import { atom } from "jotai";
import { RelicCategory } from "../../armory/schema";
import { splitAtom } from "jotai/utils";
import { focusAtom } from "jotai-optics";
import { Property } from "@/bindings/SkillTreeConfig";

export interface RelicInput {
  type: RelicCategory;
  id?: number;
  level: number;
  subStats: (SubStatSchema | undefined)[];
  rarity?: number;
  setId?: number;
  property?: Property;
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

export const relicsAtom = atom(initialRelicStruct);
export const splitRelicAtom = splitAtom(relicsAtom);

relicsAtom.debugLabel = "relicsAtom";
// splitRelicAtom.debugLabel = "splitRelicAtom";
