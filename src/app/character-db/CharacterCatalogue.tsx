"use client";

import { DbFilter } from "../components/Db/DbFilter";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import useCharacterFilter from "../components/Db/useCharacterFilter";
import { useRouter } from "next/navigation";
import { AvatarConfig } from "@/bindings/AvatarConfig";
import {
  useCharacterList,
  useSuspendedCharacterList,
} from "@/hooks/queries/useCharacterList";
import { CharacterCatalogueItem } from "./CharacterCatalogueItem";

const keys: (keyof AvatarConfig)[] = [
  "avatar_name",
  "avatar_id",
  "avatar_votag",
];

function search(data: AvatarConfig[], query: string | undefined) {
  const fz = new Fuse(data, {
    keys,
    threshold: 0.4,
  });

  if (query?.length) return fz.search(query).map((e) => e.item);
  else return data;
}

const CharacterCatalogue = () => {
  const router = useRouter();
  const { filter, query, updateQuery } = useCharacterFilter();

  const { characterList: data } = useCharacterList();

  const processedData = search(data, query)
    .filter(filter.byRarity)
    .filter(filter.byPath)
    .filter(filter.byElement);

  function onEnter(_query: string) {
    if (processedData.length > 0)
      router.push(`/character-db/${processedData[0].avatar_id}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <DbFilter
        minRarity={4}
        updateText={updateQuery}
        onEnterKey={onEnter}
        {...filter}
      />
      <div className="grid scroll-m-4 grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {processedData.map((chara) => (
          <CharacterCatalogueItem key={chara.avatar_id} chara={chara} />
        ))}
      </div>
    </div>
  );
};
export default CharacterCatalogue;
