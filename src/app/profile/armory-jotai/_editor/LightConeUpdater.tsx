"use client";

import { useLightConeMetadata } from "@/hooks/queries/useLightConeMetadata";
import { useAtom, useAtomValue } from "jotai";
import {
  lcIdAtom,
  lcImpositionAtom,
  lcLevelAtom,
  lcPromotionAtom,
  maxLevelAtom,
} from "../_store/lightcone";
import { Input } from "@/app/components/ui/Input";

export function LightConeUpdater() {
  const lcId = useAtomValue(lcIdAtom);
  const { lightCone } = useLightConeMetadata(lcId);

  return (
    <div>
      <div>{lightCone?.equipment_name}</div>

      <div className="grid grid-cols-2 gap-2">
        <div>Level</div>
        <LevelInput />

        <div>Ascension</div>
        <PromotionInput />

        <div>Imposition</div>
        <ImpositionInput />
      </div>
    </div>
  );
}

function LevelInput() {
  const maxLevel = useAtomValue(maxLevelAtom);
  const [level, setLevel] = useAtom(lcLevelAtom);

  return (
    <Input
      className="w-12"
      type="number"
      autoComplete="off"
      min={1}
      max={maxLevel}
      value={level}
      onChange={(e) => setLevel(parseInt(e.target.value))}
    />
  );
}

function PromotionInput() {
  const [ascension, setAscension] = useAtom(lcPromotionAtom);
  return (
    <Input
      className="w-12"
      type="number"
      autoComplete="off"
      min={0}
      max={6}
      value={ascension}
      onChange={(e) => {
        const val = parseInt(e.currentTarget.value);
        if (val >= 0 || val <= 6) setAscension(val);
      }}
    />
  );
}

function ImpositionInput() {
  const [rank, setRank] = useAtom(lcImpositionAtom);
  return (
    <Input
      className="w-12"
      type="number"
      autoComplete="off"
      min={1}
      max={5}
      value={rank}
      onChange={(e) => {
        const val = parseInt(e.currentTarget.value);
        if (val >= 0 || val <= 6) setRank(val);
      }}
    />
  );
}
