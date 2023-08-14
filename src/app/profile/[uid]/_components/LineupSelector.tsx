"use client";

import { HTMLAttributes, forwardRef, useContext } from "react";
import { img } from "../../page";
import { MihomoCharacter } from "../../types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CardConfigContext } from "../ConfigControllerContext";

interface Props extends HTMLAttributes<HTMLDivElement> {
  characters: MihomoCharacter[];
}

export const LineupSelector = forwardRef<HTMLDivElement, Props>(
  ({ characters, className }, ref) => {
    const { setCurrentCharacter } = useContext(CardConfigContext);

    return (
      <div
        className={cn(className, "flex gap-2 rounded-md border-2")}
        ref={ref}
      >
        {characters.map((character, index) => (
          <div key={index}>
            <Image
              src={img(character.icon)}
              width={64}
              height={64}
              alt=""
              className="cursor-pointer rounded-full border"
              onClick={() => setCurrentCharacter(character)}
            />
          </div>
        ))}
      </div>
    );
  }
);
LineupSelector.displayName = "LineupSelector";
