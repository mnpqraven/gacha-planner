"use client";

import { Provider } from "jotai";
import { ReactNode } from "react";
import { DevTools } from "jotai-devtools";

interface Props {
  children: ReactNode;
}
export function StateProvider({ children }: Props) {
  return (
    <Provider>
      {children}
      <DevTools />
    </Provider>
  );
}
