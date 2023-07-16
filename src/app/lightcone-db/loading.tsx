import { range } from "@/lib/utils";
import { Toggle } from "../components/ui/Toggle";
import { PathIcon } from "../character-db/PathIcon";
import Image from "next/image";
import { Input } from "../components/ui/Input";
import { Path } from "@/bindings/AvatarConfig";

export default function Loading() {
  const mockList = Array.from(range(1, 24, 1));
  const rarityList: number[] = Array.from(range(4, 5, 1));
  const pathList: Path[] = [
    "Destruction",
    "Hunt",
    "Erudition",
    "Preservation",
    "Harmony",
    "Nihility",
    "Abundance",
  ];

  return (
    <main className="container py-4">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="relative h-full">
          <Input placeholder="Search" className="h-12 text-lg" />
          <kbd className="pointer-events-none absolute right-2 top-[calc(50%-10px)] inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘/Ctrl + F</span>
          </kbd>
        </div>

        <div className="flex rounded-md border p-1">
          {rarityList.map((rarity) => (
            <Toggle
              key={rarity}
              className="flex text-muted-foreground hover:text-primary"
            >
              <span className="text-xl font-bold">{rarity}</span>
              <div className="aspect-square h-7">
                <Image
                  src="/Star.png"
                  height={128}
                  width={128}
                  alt={rarity + " ✦"}
                  className="pointer-events-none"
                />
              </div>
            </Toggle>
          ))}
        </div>

        <div className="flex rounded-md border p-1">
          {pathList.map((path) => (
            <Toggle
              key={path}
              className="text-muted-foreground hover:text-primary"
            >
              <PathIcon path={path} size="28px" />
            </Toggle>
          ))}
        </div>
      </div>

      <div className="grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {mockList.map((mockItem) => (
          <div key={mockItem}></div>
        ))}
      </div>
    </main>
  );
}
