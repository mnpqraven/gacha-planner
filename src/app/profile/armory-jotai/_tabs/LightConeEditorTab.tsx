"use client";

import { Button } from "@/app/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/ui/Dialog";
import { Toggle } from "@/app/components/ui/Toggle";
import { useLightConeList } from "@/hooks/queries/useLightConeList";
import { charIdAtom } from "../_store/character";
import { useAtom, useAtomValue } from "jotai";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import Image from "next/image";
import { IMAGE_URL } from "@/lib/constants";
import { useState } from "react";
import { EquipmentConfig } from "@/bindings/EquipmentConfig";
import { lcIdAtom } from "../_store/lightcone";
import { useLightConeMetadata } from "@/hooks/queries/useLightConeMetadata";
import { LightConeCard } from "@/app/lightcone-db/LightConeCard";
import { img } from "@/lib/utils";
import { LightConeUpdater } from "../_editor/LightConeUpdater";

export function LightConeEditorTab() {
  const { lightConeList } = useLightConeList();
  const charId = useAtomValue(charIdAtom);
  const [open, setOpen] = useState(false);
  const [lcId, setLcId] = useAtom(lcIdAtom);

  const { data: charMeta } = useCharacterMetadata(charId);
  const { lightCone } = useLightConeMetadata(lcId);
  const path = charMeta?.avatar_base_type;

  function onSelectLightCone(lc: EquipmentConfig) {
    setLcId(lc.equipment_id);
    setOpen(false);
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-center gap-6 p-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Change Light Cone</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="grid grid-cols-4">
              {lightConeList
                .sort(
                  (a, b) =>
                    b.rarity - a.rarity ||
                    a.equipment_name.localeCompare(b.equipment_name)
                )
                .filter((e) => e.avatar_base_type === path)
                .map((lc) => (
                  <Toggle
                    key={lc.equipment_id}
                    className="flex h-fit justify-between py-2"
                    onPressedChange={() => onSelectLightCone(lc)}
                  >
                    <Image
                      src={`${IMAGE_URL}image/light_cone_preview/${lc.equipment_id}.png`}
                      alt={lc.equipment_name}
                      width={256}
                      height={300}
                      className="aspect-[256/300] w-16"
                    />
                    <span>{lc.equipment_name}</span>
                  </Toggle>
                ))}
            </div>
          </DialogContent>
        </Dialog>

        {!!lightCone && (
          <LightConeCard
            className="h-fit w-48"
            name={lightCone.equipment_name}
            imgUrl={img(
              `image/light_cone_preview/${lightCone.equipment_id}.png`
            )}
          />
        )}

        {lightCone?.equipment_name}
      </div>

      <LightConeUpdater />
    </div>
  );
}
