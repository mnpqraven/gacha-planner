import { cn, range } from "@/lib/utils";
import { IMAGE_URL } from "@/server/endpoints";
import API from "@/server/typedEndpoints";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";
import { ElementIcon } from "./ElementIcon";
import { PathIcon } from "./PathIcon";

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
    <main className="container pt-4 grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {sortedDb.map(({ id, name, rarity, path, element }) => (
        <div key={id} className="flex flex-col items-center justify-center">
          <Link
            href={`/character-db/${id}`}
            className="relative flex flex-col items-center"
          >
            <Image
              className="cursor-pointer"
              src={url(id)}
              alt={name}
              width={374}
              height={512}
              priority={rarity === 5}
            />
            <ElementIcon
              element={element}
              size="15%"
              className="absolute left-0 top-0"
            />
            <PathIcon
              path={path}
              size="15%"
              className="absolute right-0 top-0"
            />
            <RarityIcon rarity={rarity} className="top-[85%] h-6" />
          </Link>

          <div>{name}</div>
        </div>
      ))}
    </main>
  );
}

interface RarityIconProps extends HTMLAttributes<HTMLDivElement> {
  rarity: number;
}
const RarityIcon = forwardRef<HTMLDivElement, RarityIconProps>(
  ({ rarity, className, ...props }, ref) => (
    <div
      className={cn("absolute flex justify-center", className)}
      {...props}
      ref={ref}
    >
      {Array.from(range(1, rarity, 1)).map((_, index) => (
        <div key={index} className="aspect-square">
          <Image
            src="/Star.png"
            height={128}
            width={128}
            alt={rarity + " ✦"}
            className="pointer-events-none"
          />
        </div>
      ))}
    </div>
  )
);
RarityIcon.displayName = "RarityIcon";

function url(id: string | number): string {
  return IMAGE_URL + `image/character_preview/${id}.png`;
}
function rarityUrl(rarity: number): string {
  if (rarity >= 3 && rarity <= 5)
    return IMAGE_URL + `icon/deco/Rarity${rarity}.png`;
  return IMAGE_URL + `icon/deco/Rarity5.png`;
}
