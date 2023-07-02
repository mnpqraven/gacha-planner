"use client";

import API from "@/server/typedEndpoints";
import Link from "next/link";
import { CharacterCard } from "./CharacterCard";

export default async function CharacterDb() {
  let { list } = await API.mhyCharacterList.fetch();
  let sortedDb = list.sort((a, b) => {
    return (
      b.rarity - a.rarity ||
      a.name.localeCompare(b.name) ||
      a.tag.localeCompare(b.tag)
    );
  });

  return (
    <main className="container grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 pt-4 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {sortedDb.map((chara) => (
        <div
          id="character-card"
          key={chara.id}
          className="flex flex-col items-center justify-center gap-3"
        >
          <Link
            href={`/character-db/${chara.id}`}
            className={"relative flex flex-col items-center"}
          >
            <CharacterCard data={chara} />
          </Link>

          <p className="font-semibold">{chara.name}</p>
        </div>
      ))}
    </main>
  );
}
