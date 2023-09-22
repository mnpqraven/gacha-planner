import { RelicType } from "@/bindings/RelicConfig";

export const initialCardData: CardData = {
  characterId: undefined,
  lightConeId: undefined,
  relicCfg: {
    openState: {
      HEAD: false,
      HAND: false,
      BODY: false,
      FOOT: false,
      OBJECT: false,
      NECK: false,
    },
  },
};

export function dataReducer(state: CardData, action: CardDataAction): CardData {
  const { payload, type } = action;
  switch (type) {
    case "changeCharacterId":
      return { ...state, characterId: payload };
    case "changeLightConeId":
      return { ...state, lightConeId: payload };
    case "updateWholeConfig":
      return { ...payload };
    case "changeRelicOpenState":
      return {
        ...state,
        relicCfg: {
          openState: {
            ...state.relicCfg.openState,
            [payload.type]: payload.open,
          },
        },
      };
    default:
      return state;
  }
}

/**
 * this is the underlying schema for the config component and handles
 * controlling the display of the whole character card
 */
export interface CardData {
  characterId: number | undefined;
  lightConeId: number | undefined;
  relicCfg: { openState: Record<RelicType, boolean> };
}

/**
 * this is the underlying schema for the dispatch actions
 * key: name of the action
 * value: type of the payload
 */
interface CardDataActionSchema {
  changeCharacterId: number;
  changeLightConeId: number;
  changeRelicOpenState: { type: RelicType; open: boolean };
  updateWholeConfig: CardData;
}

type TypePayloadPair<K extends keyof CardDataActionSchema> = {
  type: K;
  payload: CardDataActionSchema[K];
};

type TypePayloadPairMap = {
  [K in keyof CardDataActionSchema]: TypePayloadPair<K>;
};

export type CardDataAction = TypePayloadPairMap[keyof CardDataActionSchema];
