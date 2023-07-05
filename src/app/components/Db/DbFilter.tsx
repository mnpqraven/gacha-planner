import { Input } from "../ui/Input";
import { Element, Path } from "@/bindings/DbCharacter";
import { range } from "@/lib/utils";
import { Toggle } from "../ui/Toggle";
import Image from "next/image";
import { PathIcon } from "@/app/character-db/PathIcon";
import { ElementIcon } from "@/app/character-db/ElementIcon";

type Props = {
  text?: boolean;
  minRarity?: number;
  updateText?: (query: string) => void;
  updateRarity?: (value: number) => void;
  updatePath?: (value: Path) => void;
  updateElement?: (value: Element) => void;
};
const DbFilter = ({
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

  return (
    <div className="flex items-center justify-center gap-4">
      {text && updateText && (
        <Input
          placeholder="Search"
          className="h-12 text-lg"
          onChange={(e) => updateText(e.currentTarget.value)}
        />
      )}
      {minRarity && updateRarity && (
        <div className="flex rounded-md border p-1">
          {rarityList.map((rarity) => (
            <Toggle
              key={rarity}
              className="flex"
              onPressedChange={() => updateRarity(rarity)}
            >
              <div className="text-xl font-bold">{rarity}</div>
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
            <Toggle key={path} onPressedChange={() => updatePath(path)}>
              <PathIcon path={path} size="28px" />
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
              <ElementIcon element={element} size="28px" />
            </Toggle>
          ))}
        </div>
      )}
    </div>
  );
};

export { DbFilter };
