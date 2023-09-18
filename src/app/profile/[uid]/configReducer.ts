export const initialConfig: CardConfig = {
  showStatName: false,
  showPlayerInfo: true,
  hoverVerbosity: "simple",
  statTableConfig: {
    showEmptyStat: false,
  },
  showBaseUrl: true,
};

export function configReducer(
  state: CardConfig,
  action: CardConfigAction
): CardConfig {
  const { payload, type } = action;
  switch (type) {
    case "togglePlayerInfo":
      return { ...state, showPlayerInfo: payload };
    case "toggleStatName":
      return { ...state, showStatName: payload };
    case "changeHoverVerbosity":
      return { ...state, hoverVerbosity: payload };
    case "toggleEmptyStat":
      return {
        ...state,
        statTableConfig: { ...state.statTableConfig, showEmptyStat: payload },
      };
    case "updateWholeConfig":
      return { ...payload };
    case "changeUid":
      return { ...state, uid: payload };
    default:
      return state;
  }
}

/**
 * this is the underlying schema for the config component and handles
 * controlling the display of the whole character card
 */
export interface CardConfig {
  showPlayerInfo: boolean;
  showStatName: boolean;
  hoverVerbosity: "none" | "simple" | "detailed";
  statTableConfig: {
    showEmptyStat: boolean;
  };
  showBaseUrl: boolean;
  uid?: string;
}

/**
 * this is the underlying schema for the dispatch actions
 * key: name of the action
 * value: type of the payload
 */
interface CardConfigActionSchema {
  togglePlayerInfo: boolean;
  toggleStatName: boolean;
  changeHoverVerbosity: "none" | "simple" | "detailed";
  toggleEmptyStat: boolean;
  updateWholeConfig: CardConfig;
  changeUid: string | undefined;
}

type TypePayloadPair<K extends keyof CardConfigActionSchema> = {
  type: K;
  payload: CardConfigActionSchema[K];
};

type TypePayloadPairMap = {
  [K in keyof CardConfigActionSchema]: TypePayloadPair<K>;
};

export type CardConfigAction = TypePayloadPairMap[keyof CardConfigActionSchema];
