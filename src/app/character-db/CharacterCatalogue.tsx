"use client";

import { DbCharacter } from "@/bindings/DbCharacter";
import Link from "next/link";
import { CharacterCard } from "./CharacterCard";
import { IMAGE_URL } from "@/server/endpoints";
import { DbFilter } from "../components/Db/DbFilter";
import Fuse from "fuse.js";
import { useRef, useState } from "react";
import useCharacterFilter from "../components/Db/useCharacterFilter";
import { useRouter } from "next/navigation";

type Props = {
  data: DbCharacter[];
};

const CharacterCatalogue = ({ data }: Props) => {
  const router = useRouter();
  const filter = useCharacterFilter();
  const [searchData, setSearchData] = useState(data);
  const processedData = searchData
    .filter(filter.byRarity)
    .filter(filter.byPath)
    .filter(filter.byElement);
  const fz = new Fuse(data, {
    keys: ["name", "id", "max_sp"],
    threshold: 0.4,
  });

  function updateSearch(query: string) {
    if (query.length > 0) {
      const res = fz.search(query);
      setSearchData(res.map((e) => e.item));
    } else {
      //reset
      setSearchData(data);
    }
  }

  function onEnter(_query: string) {
    if (processedData.length > 0)
      router.push(`/character-db/${processedData[0].id}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <DbFilter
        minRarity={4}
        updateText={updateSearch}
        onEnterKey={onEnter}
        {...filter}
      />
      <div className="grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {processedData.map((chara, index) => (
          <div
            id="character-card"
            key={chara.id}
            className="flex flex-col items-center justify-center gap-3"
          >
            <Link
              href={`/character-db/${chara.id}`}
              className={"relative flex flex-col items-center"}
            >
              <CharacterCard imgUrl={url(chara.id)} {...chara} />
            </Link>

            <p className="font-semibold">{chara.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CharacterCatalogue;

function url(id: string | number): string {
  return IMAGE_URL + `image/character_preview/${id}.png`;
}
