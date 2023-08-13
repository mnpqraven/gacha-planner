"use client";

import { useContext } from "react";
import { img } from "../../page";
import { MihomoCharacter } from "../../types";
import Image from "next/image";
import { CardConfigContext } from "../ConfigController";

interface Props {
  characters: MihomoCharacter[];
}

export function LineupSelector({ characters }: Props) {
  const { setCurrentCharacter } = useContext(CardConfigContext);
  return (
    <div className="flex gap-2 rounded-md border-2 ">
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
