import { IMAGE_URL } from "@/server/endpoints";
import API from "@/server/typedEndpoints";
import Image from "next/image";

export default async function CharacterDb() {
  let { list } = await API.mhyCharacter.call();
  let sortedDb = list.sort((a, b) => {
    return b.rarity - a.rarity || a.name.localeCompare(b.name);
  });

  return (
    <main className="container grid grid-cols-6 items-center">
      {sortedDb.map(({ id, name, rarity, path, element }) => (
        <div key={id}>
          <Image src={url(id)} alt={name} width={100} height={200} />

          <div>{name}</div>
          <div>{rarity}</div>
          <div>{path}</div>
          <div>{element}</div>
        </div>
      ))}
    </main>
  );
}

function url(id: string | number): string {
  return `${IMAGE_URL}/image/character_preview/${id}.png`;
}
