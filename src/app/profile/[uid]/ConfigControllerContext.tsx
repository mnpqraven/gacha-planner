"use client";

import {
  Dispatch,
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";
import { MihomoCharacter, MihomoResponse } from "../types";
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

export const CardConfigProvider = ({ children }: { children: ReactNode }) => {
  const value = useCardConfigProvider();

  return (
    <CardConfigContext.Provider value={value}>
      {children}
    </CardConfigContext.Provider>
  );
};

function useCardConfigProvider(): CardConfigContextPayload {
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

export function useCardConfigController() {
  const context = useContext(CardConfigContext);
  if (!context) {
    throw new Error(
      "useCardConfigContext must be used within a CardConfigContext wrapper!"
    );
  }
  return context;
}
