"use client";

import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { cn, img } from "@/lib/utils";
import { Toggle } from "@/app/components/ui/Toggle";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { useAtom, useAtomValue } from "jotai";
import { mhyCharacterIds, selectedCharacterIndexAtom } from "../../_store/card";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const LineupSelector = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const charIds = useAtomValue(mhyCharacterIds);
    const [selectIndex, setSelectIndex] = useAtom(selectedCharacterIndexAtom);

    return (
      <div
        className={cn(className, "flex gap-2 rounded-md border p-2")}
        ref={ref}
        {...props}
      >
        {charIds.map((id, index) =>
          !!id ? (
            <Toggle
              key={index}
              className="h-16 w-16 rounded-full p-0"
              pressed={index == selectIndex}
            >
              <Image
                src={img(`icon/avatar/${id}.png`)}
                width={64}
                height={64}
                alt=""
                className="cursor-pointer rounded-full border"
                onClick={() => setSelectIndex(index)}
              />
            </Toggle>
          ) : (
            <Toggle key={index} className="h-16 w-16 rounded-full p-0">
              <Skeleton className="h-16 w-16 rounded-full" />
            </Toggle>
          )
        )}
      </div>
    );
  }
);
LineupSelector.displayName = "LineupSelector";
