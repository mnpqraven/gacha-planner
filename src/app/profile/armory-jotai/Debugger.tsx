"use client";

import { useAtomValue } from "jotai";
import { charStructAtom } from "./_store/character";
import { lcStructAtom } from "./_store/lightcone";
import { relicsStructAtom } from "./_store/relic";

export function Debugger() {
  const val = useAtomValue(charStructAtom);
  const val2 = useAtomValue(lcStructAtom);
  const val3 = useAtomValue(relicsStructAtom);
  return null;
}