"use client";

import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { cn, img } from "@/lib/utils";
import { useCardConfigController } from "../ConfigControllerContext";
import { Toggle } from "@/app/components/ui/Toggle";
import { MihomoCharacter } from "../../types";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  mhyCharacterIds,
  selectedCharacterIndexAtom,
} from "../../armory-jotai/_viewer/atoms";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const LineupSelector = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const charIds = useAtomValue(mhyCharacterIds);
    const [selectIndex, setSelectIndex] = useAtom(selectedCharacterIndexAtom);
    // const { setCurrentCharacter, currentCharacter, mihomoResponse } =
    //   useCardConfigController();

    // const data: MihomoCharacter[] = mihomoResponse?.characters
    //   ? mihomoResponse.characters
    //   : new Array(4).fill(undefined);

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
