"use client";

import {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
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
import { useMihomoInfo } from "./useMihomoInfo";
import { LANGS } from "@/lib/constants";
import { ArmoryFormSchema, defaultArmoryFormSchema } from "../armory/schema";

interface CardConfigContextPayload {
  currentCharacter?: MihomoCharacter;
  setCurrentCharacter: (to: MihomoCharacter) => void;

  currentCharacterId?: number; // for 'ARMORY'
  setCurrentCharacterId: (toId: number) => void; // for 'ARMORY'
  armoryFormValue: ArmoryFormSchema;
  updateArmoryFormValue: Dispatch<SetStateAction<ArmoryFormSchema>>;

  mode: "API" | "ARMORY";
  setMode: (to: "API" | "ARMORY") => void;

  enkaRef: RefObject<HTMLDivElement> | null;
  config: CardConfig;
  changeConfig: Dispatch<CardConfigAction>;
  mihomoResponse?: MihomoResponse;
  updateParam: (toUid?: string, toLang?: (typeof LANGS)[number]) => void;
}

export const defaultCardConfig: CardConfigContextPayload = {
  currentCharacter: undefined,
  setCurrentCharacter: () => {},

  currentCharacterId: undefined,
  setCurrentCharacterId: () => {},

  armoryFormValue: defaultArmoryFormSchema,
  updateArmoryFormValue: () => {},

  mode: "API",
  setMode: () => {},

  enkaRef: null,
  config: initialConfig,
  changeConfig: () => {},
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
  const [currentCharacterId, setCurrentCharacterId] = useState<
    number | undefined
  >(undefined);
  const [mode, setMode] = useState<"API" | "ARMORY">("API");

  const { query } = useMihomoInfo({ uid, lang });

  function updateParam(toUid?: string, toLang?: (typeof LANGS)[number]) {
    if (!!toUid) setUid(toUid);
    if (!!toLang) setLang(toLang);
  }

  const [config, changeConfig] = useReducer(configReducer, initialConfig);

  const [armoryFormValue, updateArmoryFormValue] = useState(
    defaultArmoryFormSchema
  );

  return {
    currentCharacter,
    setCurrentCharacter,

    currentCharacterId,
    setCurrentCharacterId,

    armoryFormValue,
    updateArmoryFormValue,

    mode,
    setMode,

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
