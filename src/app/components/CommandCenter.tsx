"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/Command";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Skeleton } from "./ui/Skeleton";
import { useRouter } from "next/navigation";
import { useLightConeList } from "@/hooks/queries/useLightConeList";
import { useCharacterList } from "@/hooks/queries/useCharacterList";
import Fuse from "fuse.js";
import { LightCone } from "@/bindings/LightConeFull";
import { DbCharacter } from "@/bindings/DbCharacter";
import { range } from "@/lib/utils";
import Image from "next/image";
import { PathIcon } from "../character-db/PathIcon";
import { ElementIcon } from "../character-db/ElementIcon";
import { cva } from "class-variance-authority";

const kbdVariants = cva(
  "pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium text-muted-foreground opacity-100 sm:inline-block",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        default: "text-[12px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

type Props = {
  routes: { path: string; label: string; icon: JSX.Element; keybind: string }[];
};
const CommandCenter = ({ routes }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { lightConeList } = useLightConeList();
  const { characterList } = useCharacterList();
  const [filteredLc, setFilteredLc] = useState<LightCone[]>([]);
  const [filteredChar, setFilteredChar] = useState<DbCharacter[]>([]);

  const fzLc = new Fuse(lightConeList, {
    keys: ["avatar_base_type", "metadata.equipment_name"],
    threshold: 0.4,
  });
  const fzChar = new Fuse(characterList, {
    keys: ["name", "element", "path"],
    threshold: 0.4,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      routes.forEach(({ keybind, path }) => {
        if (e.key === keybind && (e.altKey || e.metaKey)) {
          e.preventDefault();
          router.push(path);
          setOpen((open) => !open);
        }
      });
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router, routes]);

  function commandSelectRoute(path: string) {
    router.push(path);
    setOpen(false);
  }

  function onInputChange(to: string) {
    if (to != "") {
      setFilteredLc(fzLc.search(to).map(({ item }) => item));
      setFilteredChar(fzChar.search(to).map(({ item }) => item));
    } else {
      setFilteredChar([]);
      setFilteredLc([]);
    }
  }

  useEffect(() => {
    if (!open) {
      setFilteredChar([]);
      setFilteredLc([]);
    }
  }, [open]);

  return (
    <>
      <Button
        variant="outline"
        className="w-fit text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <span className="mr-4 hidden md:inline-block">Command Center</span>
        <span className="m-0 sm:mr-4 md:hidden">Cmd</span>
        <div className="flex">
          <kbd className={kbdVariants()}>⌘/Ctrl</kbd>
          {" + "}
          <kbd className={kbdVariants()}>K</kbd>
        </div>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Click on a result or search (character, light cone)..."
          onValueChange={onInputChange}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredChar.length > 0 && (
            <CommandGroup heading="Character">
              {filteredChar.map(({ id, name, element, path, rarity, tag }) => (
                <CommandItem
                  key={id}
                  value={`${name}-${tag}`}
                  className="w-full justify-between"
                  onSelect={() => {
                    router.push(`/character-db/${id}`);
                    setOpen(false);
                  }}
                >
                  <div className="flex gap-2">
                    <PathIcon path={path} size="auto" />
                    <ElementIcon element={element} size="auto" />
                    <span>{name}</span>
                  </div>

                  <div className="flex">
                    {Array.from(range(1, rarity, 1)).map((rarity) => (
                      <Image
                        key={rarity}
                        width={20}
                        height={20}
                        src="/Star.png"
                        alt={`${rarity} *`}
                      />
                    ))}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {filteredLc.length > 0 && (
            <CommandGroup heading="Light Cone">
              {filteredLc.map(({ metadata } ) => (
                <CommandItem
                  key={metadata.equipment_id}
                  value={`${metadata.equipment_name}-${metadata.equipment_id}`}
                  className="w-full justify-between"
                  onSelect={() => {
                    router.push(`/lightcone-db/${metadata.equipment_id}`);
                    setOpen(false);
                  }}
                >
                  <div className="flex gap-2">
                    <PathIcon path={metadata.avatar_base_type} size="auto" />
                    <span>{metadata.equipment_name}</span>
                  </div>
                  <div className="flex">
                    {Array.from(range(1, metadata.rarity, 1)).map((rarity) => (
                      <Image
                        key={rarity}
                        width={20}
                        height={20}
                        src="/Star.png"
                        alt={`${rarity} *`}
                      />
                    ))}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup heading="Tools">
            {routes.map(({ path, icon, label, keybind }) => (
              <CommandItem onSelect={() => commandSelectRoute(path)} key={path}>
                <span className="mr-2">{icon}</span>
                <span>{label}</span>
                {keybind && (
                  <CommandShortcut>
                    <kbd className={kbdVariants()}>⌘/Alt</kbd>
                    {" + "}
                    <kbd className={kbdVariants()}>{keybind.toUpperCase()}</kbd>
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export { CommandCenter };
