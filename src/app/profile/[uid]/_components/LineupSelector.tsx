"use client";

import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { cn, img } from "@/lib/utils";
import { useCardConfigController } from "../ConfigControllerContext";
import { Toggle } from "@/app/components/ui/Toggle";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const LineupSelector = forwardRef<HTMLDivElement, Props>(
  ({ className }, ref) => {
    const { setCurrentCharacter, currentCharacter, mihomoResponse } =
      useCardConfigController();

    if (!mihomoResponse) return null;

    const { characters } = mihomoResponse;

    return (
      <div
        className={cn(className, "flex gap-2 rounded-md border p-2")}
        ref={ref}
      >
        {characters.map((character, index) => (
          <Toggle
            key={index}
            className="h-16 w-16 rounded-full p-0"
            pressed={character.id == currentCharacter?.id}
          >
            <Image
              src={img(character.icon)}
              width={64}
              height={64}
              alt=""
              className="cursor-pointer rounded-full border"
              onClick={() => setCurrentCharacter(character)}
            />
          </Toggle>
        ))}
      </div>
    );
  }
);
LineupSelector.displayName = "LineupSelector";
