import { cn, range } from "@/lib/utils";
import { IMAGE_URL } from "@/server/endpoints";
import API from "@/server/typedEndpoints";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";
import { ElementIcon } from "./ElementIcon";
import { PathIcon } from "./PathIcon";

export default async function CharacterDb() {
  let { list } = await API.mhyCharacter.call();
  let sortedDb = list.sort((a, b) => {
    return (
      b.rarity - a.rarity ||
      a.name.localeCompare(b.name) ||
      a.tag.localeCompare(b.tag)
    );
  });

  return (
    <main className="container grid 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 scroll-m-4 gap-2 md:gap-6 sm:gap-4 items-center justify-center">
      {sortedDb.map(({ id, name, rarity, path, element }) => (
        <div key={id} className="flex flex-col items-center justify-center">
          <Link
            href={`/character-db/${id}`}
            className="flex flex-col items-center relative"
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
              className="absolute top-0 right-0"
            />
            <PathIcon
              path={path}
              size="15%"
              className="absolute top-0 left-0"
            />
            <RarityIcon rarity={rarity} className="h-6 top-[85%]" />
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
