import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef, useMemo } from "react";
import { useAtomValue } from "jotai";
import { RelicBox } from "@/app/card/[uid]/_components/relic_block/RelicBox";
import { SetInfo } from "./SetInfo";
import { configAtom, relicsStructAtom } from "@/app/card/_store";
import { selectAtom } from "jotai/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const RelicInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const showBaseUrl = useAtomValue(
      useMemo(() => selectAtom(configAtom, (atom) => atom.showBaseUrl), [])
    );
    const uid = useAtomValue(
      useMemo(() => selectAtom(configAtom, (atom) => atom.uid), [])
    );
    const characterRelics = useAtomValue(relicsStructAtom);

    return (
      <div
        className={cn("flex flex-col gap-2", className)}
        ref={ref}
        {...props}
      >
        {showBaseUrl && (
          <span className="flex-1 self-end text-muted-foreground">
            hsr.othi.dev/card{!!uid ? `/${uid}` : ""}
          </span>
        )}

        <div className={cn("grid grid-cols-2 gap-2 place-self-center")}>
          {characterRelics.map((relic, index) => (
            <RelicBox
              data={relic}
              key={index}
              active={isActive(relic.setId, characterRelics)}
            />
          ))}
        </div>

        <SetInfo relics={characterRelics} />
      </div>
    );
  }
);
RelicInfo.displayName = "RelicInfo";

function isActive<T extends { setId?: number }>(
  currentSetId: number | undefined,
  relics: T[]
) {
  const count = relics.filter((e) => e.setId == currentSetId).length;
  return count >= 2;
}
