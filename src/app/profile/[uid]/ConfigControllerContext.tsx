"use client";

import {
  Dispatch,
  ReactNode,
  RefObject,
  createContext,
  useReducer,
  useRef,
  useState,
} from "react";
import { MihomoCharacter, MihomoPlayer, MihomoResponse } from "../types";
import {
  CardConfig,
  CardConfigAction,
  configReducer,
  initialConfig,
} from "./configReducer";

interface CardConfigContextPayload {
  currentCharacter?: MihomoCharacter;
  setCurrentCharacter: (to: MihomoCharacter) => void;
  enkaRef: RefObject<HTMLDivElement> | null;
  config: CardConfig;
  changeConfig: Dispatch<CardConfigAction>;
  initResponse: (to: MihomoResponse) => void;
  mihomoResponse?: MihomoResponse;
}

export const defaultCardConfig: CardConfigContextPayload = {
  currentCharacter: undefined,
  setCurrentCharacter: () => {},
  enkaRef: null,
  config: initialConfig,
  changeConfig: () => {},
  initResponse: () => {},
  mihomoResponse: undefined,
};

export const CardConfigContext =
  createContext<CardConfigContextPayload>(defaultCardConfig);

export const CardConfigController = ({ children }: { children: ReactNode }) => {
  const value = useCardConfigController();
  return (
    <CardConfigContext.Provider value={value}>
      {children}
    </CardConfigContext.Provider>
  );
};

function useCardConfigController(): CardConfigContextPayload {
  // for the character selector
  const [currentCharacter, setCurrentCharacter] = useState<
    MihomoCharacter | undefined
  >(undefined);
  // for image exporting
  const enkaRef = useRef<HTMLDivElement>(null);

  const [mihomoResponse, setMihomoResponse] = useState<
    MihomoResponse | undefined
  >(undefined);

  const [config, changeConfig] = useReducer(configReducer, initialConfig);

  return {
    currentCharacter,
    setCurrentCharacter,
    enkaRef,
    config,
    changeConfig,
    initResponse: setMihomoResponse,
    mihomoResponse,
  };
}
