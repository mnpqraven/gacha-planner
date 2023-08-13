"use client";

import { ReactNode, createContext, useState } from "react";
import { MihomoCharacter, MihomoPlayer } from "../types";

interface CardConfigContextPayload {
  currentCharacter?: MihomoCharacter;
  setCurrentCharacter: (to: MihomoCharacter) => void;
  player?: MihomoPlayer
  setPlayer: (to: MihomoPlayer) => void;
}

export const defaultCardConfig: CardConfigContextPayload = {
  currentCharacter: undefined,
  setCurrentCharacter: () => {},
  player: undefined,
  setPlayer: () => {}
};

export const CardConfigContext =
  createContext<CardConfigContextPayload>(defaultCardConfig);

function useCardConfigController(): CardConfigContextPayload {
  const [currentCharacter, setCurrentCharacter] = useState<
    MihomoCharacter | undefined
  >(undefined);
  const [player, setPlayer] = useState<MihomoPlayer | undefined>(undefined)

  return { currentCharacter, setCurrentCharacter, player, setPlayer };
}
export const CardConfigController = ({ children }: { children: ReactNode }) => {
  const value = useCardConfigController();
  return (
    <CardConfigContext.Provider value={value}>
      {children}
    </CardConfigContext.Provider>
  );
};
