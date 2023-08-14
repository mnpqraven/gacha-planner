"use client";

import {
  ReactNode,
  RefObject,
  createContext,
  useReducer,
  useRef,
  useState,
} from "react";
import { MihomoCharacter, MihomoPlayer } from "../types";
import { configReducer, initialConfig } from "./configReducer";

interface CardConfigContextPayload {
  currentCharacter?: MihomoCharacter;
  setCurrentCharacter: (to: MihomoCharacter) => void;
  player?: MihomoPlayer;
  setPlayer: (to: MihomoPlayer) => void;
  enkaRef: RefObject<HTMLDivElement> | null;
}

export const defaultCardConfig: CardConfigContextPayload = {
  currentCharacter: undefined,
  setCurrentCharacter: () => {},
  player: undefined,
  setPlayer: () => {},
  enkaRef: null,
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
  // for universal player info
  const [player, setPlayer] = useState<MihomoPlayer | undefined>(undefined);
  // for image exporting
  const enkaRef = useRef<HTMLDivElement>(null);

  const [config, dispatch] = useReducer(configReducer, initialConfig);

  return { currentCharacter, setCurrentCharacter, player, setPlayer, enkaRef };
}
