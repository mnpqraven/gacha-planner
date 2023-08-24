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
import { useMihomoInfo, useSuspendedMihomoInfo } from "./useMihomoInfo";
import { LANGS } from "@/lib/constants";

interface CardConfigContextPayload {
  currentCharacter?: MihomoCharacter;
  setCurrentCharacter: (to: MihomoCharacter) => void;
  enkaRef: RefObject<HTMLDivElement> | null;
  config: CardConfig;
  changeConfig: Dispatch<CardConfigAction>;
  // initResponse: (to: MihomoResponse) => void;
  mihomoResponse?: MihomoResponse;
  updateParam: (toUid?: string, toLang?: (typeof LANGS)[number]) => void;
}

export const defaultCardConfig: CardConfigContextPayload = {
  currentCharacter: undefined,
  setCurrentCharacter: () => {},
  enkaRef: null,
  config: initialConfig,
  changeConfig: () => {},
  // initResponse: () => {},
  mihomoResponse: undefined,
  updateParam: () => {},
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

  const [uid, setUid] = useState<string | undefined>(undefined);
  const [lang, setLang] = useState<(typeof LANGS)[number]>("en");

  const { query } = useMihomoInfo({ uid, lang });

  function updateParam(toUid?: string, toLang?: (typeof LANGS)[number]) {
    if (!!toUid) setUid(toUid);
    if (!!toLang) setLang(toLang);
  }

  const [config, changeConfig] = useReducer(configReducer, initialConfig);

  return {
    currentCharacter,
    setCurrentCharacter,
    enkaRef,
    config,
    changeConfig,
    // initResponse: setMihomoResponse,
    mihomoResponse: query.data,
    updateParam,
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
