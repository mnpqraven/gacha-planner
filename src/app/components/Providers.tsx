"use client";
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { TooltipProvider } from "./ui/Tooltip";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

const TANSTACK_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
};

type RootProps = {
  children: React.ReactNode;
};
export default function RQProvider({ children }: RootProps) {
  const [queryClient] = useState(() => new QueryClient(TANSTACK_CONFIG));
  return (
    <ThemeProvider attribute="class">
      <TooltipProvider delayDuration={300}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
        </QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
