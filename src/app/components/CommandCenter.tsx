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
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Button } from "./ui/Button";
import { Command as CommandPrimitive } from "cmdk";
import { useRouter } from "next/navigation";
import { useLightConeList } from "@/hooks/queries/useLightConeList";
import { useCharacterList } from "@/hooks/queries/useCharacterList";
import Fuse from "fuse.js";
import { range } from "@/lib/utils";
import Image from "next/image";
import { PathIcon } from "../character-db/PathIcon";
import { ElementIcon } from "../character-db/ElementIcon";
import { cva } from "class-variance-authority";
import { AvatarConfig } from "@/bindings/AvatarConfig";
import { EquipmentConfig } from "@/bindings/EquipmentConfig";

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

interface Route {
  path: string;
  label: string;
  icon: JSX.Element;
  keybind: string;
}

interface Props {
  routes: Route[];
}

const CommandCenter = ({ routes }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: lightConeList } = useLightConeList();
  const { characterList } = useCharacterList();
  const [filteredLc, setFilteredLc] = useState<EquipmentConfig[]>([]);
  const [filteredChar, setFilteredChar] = useState<AvatarConfig[]>([]);

  const keysLc: (keyof EquipmentConfig)[] = [
    "equipment_name",
    "avatar_base_type",
    "equipment_id",
  ];
  const keysChar: (keyof AvatarConfig)[] = [
    "avatar_name",
    "damage_type",
    "avatar_base_type",
    "avatar_id",
  ];
  const fzLc = new Fuse(lightConeList, {
    keys: keysLc,
    threshold: 0.4,
  });
  const fzChar = new Fuse(characterList, {
    keys: keysChar,
    threshold: 0.4,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
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
        size="sm"
        className="w-fit text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <span className="mr-4 hidden md:inline-block">Command Center</span>
        <span className="m-0 sm:mr-4 md:hidden">Cmd</span>
        <div className="flex">
          <kbd className={kbdVariants()}>⌘/Ctrl + K</kbd>
        </div>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} loop>
        <CommandInput
          placeholder="Click on a result or search (character, light cone)..."
          onValueChange={onInputChange}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredChar.length > 0 && (
            <CommandGroup heading="Character">
              {filteredChar.map((chara) => (
                <CommandItem
                  key={chara.avatar_id}
                  value={keysChar.map((key) => chara[key]).join("-")}
                  className="w-full justify-between"
                  onSelect={() => {
                    router.push(`/character-db/${chara.avatar_id}`);
                    setOpen(false);
                  }}
                >
                  <div className="flex gap-2">
                    <PathIcon path={chara.avatar_base_type} size="auto" />
                    <ElementIcon element={chara.damage_type} size="auto" />
                    <span>{chara.avatar_name}</span>
                  </div>

                  <div className="flex">
                    {Array.from(range(1, chara.rarity, 1)).map((rarity) => (
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
              {filteredLc.map((lc) => (
                <CommandItem
                  key={lc.equipment_id}
                  value={keysLc.map((key) => lc[key]).join("-")}
                  className="w-full justify-between"
                  onSelect={() => {
                    router.push(`/lightcone-db/${lc.equipment_id}`);
                    setOpen(false);
                  }}
                >
                  <div className="flex gap-2">
                    <PathIcon path={lc.avatar_base_type} size="auto" />
                    <span>{lc.equipment_name}</span>
                  </div>
                  <div className="flex">
                    {Array.from(range(1, lc.rarity, 1)).map((rarity) => (
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
            {routes.map((route) => (
              <RouteItem
                onSelect={() => commandSelectRoute(route.path)}
                key={route.path}
                {...route}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
export { CommandCenter };

interface RouteItemProps
  extends Route,
    ComponentPropsWithoutRef<typeof CommandItem> {}

const RouteItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  RouteItemProps
>(({ keybind, path, icon, label, onSelect, ...props }, ref) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === keybind && (e.altKey || e.metaKey)) {
        e.preventDefault();
        if (!!onSelect) {
          onSelect(path);
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CommandItem onSelect={onSelect} {...props} ref={ref}>
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
      {keybind && (
        <CommandShortcut>
          <kbd className={kbdVariants()}>⌘/Alt + {keybind.toUpperCase()}</kbd>
        </CommandShortcut>
      )}
    </CommandItem>
  );
});
RouteItem.displayName = "RouteItem";
