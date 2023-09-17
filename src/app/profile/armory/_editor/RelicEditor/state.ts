import { atom } from "jotai";
import { ArmoryFormSchema } from "../../schema";

export const relicAtom = atom<ArmoryFormSchema["relic"]>({
  BODY: {
    id: null,
    rarity: 5,
    setId: null,
    level: 0,
    mainStat: { property: "Attack", value: 0 },
    subStats: [],
  },
});
