"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { TooltipProvider } from "./ui/Tooltip";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

type RootProps = {
  children: React.ReactNode;
};
export default function RQProvider({ children }: RootProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      })
  );
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
