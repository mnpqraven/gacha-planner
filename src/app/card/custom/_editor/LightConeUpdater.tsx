"use client";

import { useAtom, useAtomValue } from "jotai";
import { lcImpositionAtom, lcLevelAtom, lcPromotionAtom } from "../../_store";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { maxLevelAtom } from "../../_store/lightcone";

export function LightConeUpdater() {
  const maxLevel = useAtomValue(maxLevelAtom);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="level">Level</Label>
        <LevelInput id="level" />
        <span>/{maxLevel}</span>
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
>(({ className, ...props }, ref) => {
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
      onChange={(e) => {
        const val = Number(e.target.value);
        if (val >= 1 && val <= maxLevel) setLevel(val);
        else if (val == 0) setLevel(1);
      }}
      {...props}
      ref={ref}
    />
  );
});
LevelInput.displayName = "LevelInput";

const PromotionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
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
        const val = Number(e.currentTarget.value);
        if (val >= 0 && val <= 6) setAscension(val);
      }}
      {...props}
      ref={ref}
    />
  );
});
PromotionInput.displayName = "PromotionInput";

const ImpositionInput = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
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
        const val = Number(e.currentTarget.value);
        if (val >= 0 && val <= 6) setRank(val);
      }}
      {...props}
      ref={ref}
    />
  );
});
ImpositionInput.displayName = "ImpositionInput";
