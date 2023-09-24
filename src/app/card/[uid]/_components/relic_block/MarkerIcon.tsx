import { relicsStructAtom } from "@/app/card/_store";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { HTMLAttributes, forwardRef } from "react";

interface MarkerIconProps extends HTMLAttributes<HTMLSpanElement> {
  setId: number | undefined;
}
export const MarkerIcon = forwardRef<HTMLSpanElement, MarkerIconProps>(
  ({ setId, className, ...props }, ref) => {
    const characterRelics = useAtomValue(relicsStructAtom);
    const active = isActive(setId, characterRelics);

    return active ? (
      <span
        className={cn("h-2 w-2 rounded-full bg-green-600", className)}
        style={{
          boxShadow: "0 0 5px 1px rgb(22 163 74)",
        }}
        ref={ref}
        {...props}
      />
    ) : null;
  }
);
MarkerIcon.displayName = "MarkerIcon";

function isActive<T extends { setId?: number }>(
  currentSetId: number | undefined,
  relics: T[]
) {
  if (!currentSetId) return false;
  const count = relics.filter((e) => e.setId == currentSetId).length;
  return count >= 2;
}
