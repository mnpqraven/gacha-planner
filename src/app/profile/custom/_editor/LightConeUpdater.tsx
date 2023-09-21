"use client";

import { useAtom, useAtomValue } from "jotai";
import { lcImpositionAtom, lcLevelAtom, lcPromotionAtom } from "../../_store";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { maxLevelAtom } from "../../_store/lightcone";

export function LightConeUpdater() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="level">Level</Label>
        <LevelInput id="level" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="promotion">Ascension</Label>
        <PromotionInput id="promotion" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="rank">Imposition</Label>
        <ImpositionInput id="rank" />
      </div>
    </div>
  );
}

const LevelInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }) => {
  const maxLevel = useAtomValue(maxLevelAtom);
  const [level, setLevel] = useAtom(lcLevelAtom);

  return (
    <Input
      className={cn("w-12", className)}
      type="number"
      autoComplete="off"
      min={1}
      max={maxLevel}
      value={level}
      onChange={(e) => setLevel(parseInt(e.target.value))}
      {...props}
    />
  );
});
LevelInput.displayName = "LevelInput";

const PromotionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }) => {
  const [ascension, setAscension] = useAtom(lcPromotionAtom);
  return (
    <Input
      className={cn("w-12", className)}
      type="number"
      autoComplete="off"
      min={0}
      max={6}
      value={ascension}
      onChange={(e) => {
        const val = parseInt(e.currentTarget.value);
        if (val >= 0 || val <= 6) setAscension(val);
      }}
      {...props}
    />
  );
});
PromotionInput.displayName = "PromotionInput";

const ImpositionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }) => {
  const [rank, setRank] = useAtom(lcImpositionAtom);
  return (
    <Input
      className={cn("w-12", className)}
      type="number"
      autoComplete="off"
      min={1}
      max={5}
      value={rank}
      onChange={(e) => {
        const val = parseInt(e.currentTarget.value);
        if (val >= 0 || val <= 6) setRank(val);
      }}
      {...props}
    />
  );
});
ImpositionInput.displayName = "ImpositionInput";
