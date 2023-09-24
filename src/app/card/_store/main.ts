import { atom } from "jotai";
import { lcStructAtom } from "./lightcone";
import { relicsStructAtom } from "./relic";
import { charStructAtom } from "./character";
import {
  ParsedRelicSchema,
  StatParserConstructor,
} from "@/hooks/useStatParser";
import { atomWithReducer } from "jotai/utils";
import {
  CardConfig,
  CardConfigAction,
  configReducer,
  initialConfig,
} from "../[uid]/configReducer";

export const configAtom = atomWithReducer<CardConfig, CardConfigAction>(
  initialConfig,
  configReducer
);

export const armoryStructAtom = atom((get) => ({
  player: get(charStructAtom),
  relic: get(relicsStructAtom),
  lc: get(lcStructAtom),
}));

export const statParseParam = atom<StatParserConstructor | undefined>((get) => {
  const charId = get(charStructAtom).id;
  const lcId = get(lcStructAtom).id;
  const relic = get(relicsStructAtom).filter((e) => !!e.property && e.setId);
  if (!charId || !lcId) return undefined;
  return {
    character: {
      level: get(charStructAtom).level,
      id: charId,
      ascension: get(charStructAtom).ascension,
    },
    traceTable: get(charStructAtom).trace,
    lightCone: {
      id: lcId,
      level: get(lcStructAtom).level,
      ascension: get(lcStructAtom).ascension,
      imposition: get(lcStructAtom).imposition,
    },
    relic: relic as ParsedRelicSchema[],
  };
});

armoryStructAtom.debugLabel = "armoryStructAtom";
configAtom.debugLabel = "configAtom";
statParseParam.debugLabel = "statParseParam";
