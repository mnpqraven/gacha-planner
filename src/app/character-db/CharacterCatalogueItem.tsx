"use client";

import { AvatarConfig } from "@/bindings/AvatarConfig";
import { CharacterCard } from "./CharacterCardWrapper";
import Link from "next/link";
import { IMAGE_URL } from "@/lib/constants";

interface Props {
  chara: AvatarConfig;
}
export function CharacterCatalogueItem({ chara }: Props) {
  return (
    <div
      id="character-card"
      key={chara.avatar_id}
      className="flex flex-col gap-2"
    >
      <Link href={`/character-db/${chara.avatar_id}`}>
        <CharacterCard
          imgUrl={url(chara.avatar_id)}
          avatar_base_type={chara.avatar_base_type}
          avatar_name={chara.avatar_name}
          rarity={chara.rarity}
          damage_type={chara.damage_type}
        />
      </Link>

      <Link
        href={`/character-db/${chara.avatar_id}`}
        className="flex grow items-center justify-center text-center"
      >
        {chara.avatar_name}
      </Link>
    </div>
  );
}

function url(id: string | number): string {
  return IMAGE_URL + `image/character_preview/${id}.png`;
}
