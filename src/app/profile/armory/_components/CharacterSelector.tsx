"use client";

import { useCharacterList } from "@/hooks/queries/useCharacterList";
import { useCardConfigController } from "../../[uid]/ConfigControllerContext";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/ui/Dialog";
import { DbFilter } from "@/app/components/Db/DbFilter";
import useCharacterFilter from "@/app/components/Db/useCharacterFilter";
import { AvatarConfig } from "@/bindings/AvatarConfig";
import Image from "next/image";
import { img } from "@/lib/utils";
import { Toggle } from "@/app/components/ui/Toggle";
import { Button } from "@/app/components/ui/Button";
import { useState } from "react";

export function CharacterSelector() {
  const { characterList } = useCharacterList();
  const { setCurrentCharacterId } = useCardConfigController();
  const sorted = characterList.sort((a, b) => {
    return (
      b.rarity - a.rarity ||
      a.avatar_name.localeCompare(b.avatar_name) ||
      a.avatar_votag.localeCompare(b.avatar_votag)
    );
  });
  const [open, setOpen] = useState(false);

  const filter = useCharacterFilter();

  function onCharacterSelect(to: AvatarConfig) {
    setCurrentCharacterId(to.avatar_id);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Choose Character
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DbFilter minRarity={4} {...filter} />

        <div className="grid grid-cols-4">
          {sorted.map((chara) => (
            <CharacterSelectItem
              key={chara.avatar_id}
              chara={chara}
              onSelect={onCharacterSelect}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ItemProps {
  chara: AvatarConfig;
  onSelect: (to: AvatarConfig) => void;
}
function CharacterSelectItem({ chara, onSelect }: ItemProps) {
  return (
    <Toggle
      className="flex h-auto items-start justify-start p-2"
      onPressedChange={() => onSelect(chara)}
    >
      <Image
        src={avatarUrl(chara.avatar_id)}
        alt={chara.avatar_name}
        width={64}
        height={64}
      />
      <span className="grow justify-self-center">{chara.avatar_name}</span>
    </Toggle>
  );
}

function avatarUrl(id: number) {
  return img(`/icon/avatar/${id}.png`);
}
