"use client";

import { DbFilter } from "@/app/components/Db/DbFilter";
import useCharacterFilter from "@/app/components/Db/useCharacterFilter";
import { Button } from "@/app/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/ui/Dialog";
import { Toggle } from "@/app/components/ui/Toggle";
import { AvatarConfig } from "@/bindings/AvatarConfig";
import { useCharacterList } from "@/hooks/queries/useCharacterList";
import { img } from "@/lib/utils";
import { useAtom, useSetAtom } from "jotai";
import Image from "next/image";
import { useState } from "react";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { CharacterCard } from "@/app/character-db/CharacterCardWrapper";
import { CharacterUpdater } from "../_editor/CharacterUpdater";
import { TraceTableUpdater } from "../_editor/TraceTableUpdater";
import { charIdAtom, lcIdAtom } from "../../_store";

export function CharacterEditorTab() {
  const [charId, updateId] = useAtom(charIdAtom);
  const updateLcId = useSetAtom(lcIdAtom);
  const { data: chara } = useCharacterMetadata(charId);
  const { characterList } = useCharacterList();
  const [open, setOpen] = useState(false);
  const sorted = characterList.sort((a, b) => {
    return (
      b.rarity - a.rarity ||
      a.avatar_name.localeCompare(b.avatar_name) ||
      a.avatar_votag.localeCompare(b.avatar_votag)
    );
  });
  const filter = useCharacterFilter();

  function onCharacterSelect(to: AvatarConfig) {
    updateId(to.avatar_id);
    updateLcId(undefined);
    setOpen(false);
  }

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center justify-center gap-6 p-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Choose Character</Button>
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

        {!!chara && (
          <CharacterCard
            className="h-fit w-48 p-4"
            imgUrl={url(chara.avatar_id)}
            avatar_base_type={chara.avatar_base_type}
            avatar_name={chara.avatar_name}
            rarity={chara.rarity}
            damage_type={chara.damage_type}
          />
        )}

        {chara?.avatar_name}
      </div>

      <CharacterUpdater />

      {!!chara && (
        <TraceTableUpdater
          characterId={chara.avatar_id}
          path={chara.avatar_base_type}
        />
      )}
    </div>
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

function url(id: string | number): string {
  return img(`image/character_preview/${id}.png`);
}
