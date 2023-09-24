import { atom } from "jotai";
import {
  lcIdAtom,
  lcImpositionAtom,
  lcLevelAtom,
  lcPromotionAtom,
  lcStructAtom,
} from "./lightcone";
import { relicsStructAtom } from "./relic";
import {
  charIdAtom,
  charLevelAtom,
  charPromotionAtom,
  charStructAtom,
  charTraceAtom,
} from "./character";
import {
  ParsedRelicSchema,
  StatParserConstructor,
} from "@/hooks/useStatParser";
import { atomWithReducer, selectAtom } from "jotai/utils";
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

export const hoverVerbosityAtom = selectAtom(
  configAtom,
  (atom) => atom.hoverVerbosity
);

export const armoryStructAtom = atom((get) => ({
  player: get(charStructAtom),
  relic: get(relicsStructAtom),
  lc: get(lcStructAtom),
}));

export const statParseParam = atom<StatParserConstructor | undefined>((get) => {
  const charId = get(charIdAtom);
  const lcId = get(lcIdAtom);
  const relic = get(relicsStructAtom).filter((e) => !!e.property && e.setId);
  if (!charId || !lcId) return undefined;
  return {
    character: {
      level: get(charLevelAtom),
      id: charId,
      ascension: get(charPromotionAtom),
    },
    traceTable: get(charTraceAtom),
    lightCone: {
      id: lcId,
      level: get(lcLevelAtom),
      ascension: get(lcPromotionAtom),
      imposition: get(lcImpositionAtom),
    },
    relic: relic as ParsedRelicSchema[],
  };
});

configAtom.debugLabel = "configAtom";
statParseParam.debugLabel = "statParseParam";
armoryStructAtom.debugLabel = "armoryStructAtom";
