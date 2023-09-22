"use client";

import { Provider } from "jotai";
import { ReactNode } from "react";
import { DevTools } from "jotai-devtools";

interface Props {
  devTools?: boolean;
  children: ReactNode;
}
export function StateProvider({ children, devTools = false }: Props) {
  return (
    <Provider>
      {children}
      {devTools && <DevTools />}
    </Provider>
  );
}
