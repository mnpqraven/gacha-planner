import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { RelicCategory } from "@/app/profile/armory/schema";
import { useAtomValue } from "jotai";
import { relicsStructAtom } from "@/app/profile/armory-jotai/_store/relic";
import { configAtom } from "@/app/profile/armory-jotai/_store/main";
import { RelicBox } from "@/app/profile/armory-jotai/_viewer/_relic/RelicBox";
import { SetInfo } from "./SetInfo";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const RelicInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const config = useAtomValue(configAtom);
    const characterRelics = useAtomValue(relicsStructAtom);

    return (
      <div
        className={cn("flex flex-col gap-2", className)}
        ref={ref}
        {...props}
      >
        {config.showBaseUrl && (
          <span className="flex-1 self-end text-muted-foreground">
            hsr.othi.dev/profile{!!config.uid ? `/${config.uid}` : ""}
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

        <SetInfo relics={characterRelics} config={config} />
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
