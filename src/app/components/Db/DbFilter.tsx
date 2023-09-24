import { Input } from "../ui/Input";
import { range } from "@/lib/utils";
import { Toggle } from "../ui/Toggle";
import Image from "next/image";
import { PathIcon } from "@/app/character-db/PathIcon";
import { ElementIcon } from "@/app/character-db/ElementIcon";
import { useEffect, useRef } from "react";
import { Element, Path } from "@/bindings/AvatarConfig";

type Props = {
  onEnterKey?: (searchText: string) => void;
  text?: boolean;
  minRarity?: number;
  updateText?: (query: string) => void;
  updateRarity?: (value: number) => void;
  updatePath?: (value: Path) => void;
  updateElement?: (value: Element) => void;
};
const DbFilter = ({
  onEnterKey,
  text = true,
  minRarity,
  updateText,
  updateRarity,
  updatePath,
  updateElement,
}: Props) => {
  const rarityList: number[] = Array.from(range(minRarity ?? 3, 5, 1));
  const pathList: Path[] = [
    "Destruction",
    "Hunt",
    "Erudition",
    "Preservation",
    "Harmony",
    "Nihility",
    "Abundance",
  ];
  const elementList: Element[] = [
    "Fire",
    "Ice",
    "Wind",
    "Lightning",
    "Physical",
    "Quantum",
    "Imaginary",
  ];

  // keybinds
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        // focus input
        e.preventDefault();
        searchInput.current?.focus();
      }
      if (e.key === "Enter" && onEnterKey) {
        e.preventDefault();
        onEnterKey(searchInput.current?.value ?? "");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onEnterKey]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      {text && updateText && (
        <div className="flex gap-2">
          <div className="relative h-full">
            <Input
              ref={searchInput}
              placeholder="Search"
              className="h-12 text-lg"
              onChange={(e) => updateText(e.currentTarget.value)}
            />

            <kbd className="pointer-events-none absolute right-2 top-[calc(50%-10px)] inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘/Ctrl + F</span>
            </kbd>
          </div>
        </div>
      )}
      {minRarity && updateRarity && (
        <div className="flex rounded-md border p-1">
          {rarityList.map((rarity) => (
            <Toggle
              key={rarity}
              className="flex text-muted-foreground hover:text-primary"
              onPressedChange={() => updateRarity(rarity)}
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
      )}
      {updatePath && (
        <div className="flex rounded-md border p-1">
          {pathList.map((path) => (
            <Toggle
              key={path}
              onPressedChange={() => updatePath(path)}
              className="text-muted-foreground hover:text-primary"
            >
              <PathIcon path={path} size="26px" />
            </Toggle>
          ))}
        </div>
      )}
      {updateElement && (
        <div className="flex rounded-md border p-1">
          {elementList.map((element) => (
            <Toggle
              key={element}
              onPressedChange={() => updateElement(element)}
            >
              <ElementIcon element={element} size="26px" />
            </Toggle>
          ))}
        </div>
      )}
    </div>
  );
};

export { DbFilter };
