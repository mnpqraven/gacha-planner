"use client";

import Image from "next/image";
import { ElementIcon } from "./ElementIcon";
import { PathIcon } from "./PathIcon";
import { HTMLAttributes, forwardRef } from "react";
import { cn, range } from "@/lib/utils";
import styles from "@/css/floating-card.module.css";
import { Path } from "@/bindings/LightConeFull";
import { Element } from "@/bindings/PatchBanner";
import useCardEffect from "@/hooks/animation/useCardEffect";

type Props = {
  rarity: number;
  damage_type?: Element;
  avatar_base_type: Path;
  avatar_name: string;
  imgUrl: string;
};

const CharacterCard = ({
  rarity,
  avatar_base_type,
  avatar_name,
  damage_type,
  imgUrl,
}: Props) => {
  const { glowRef, flowRef, rotateToMouse, removeListener } = useCardEffect();
  return (
    <div style={{ perspective: "1500px" }}>
      <div
        ref={flowRef}
        className={cn(
          "relative h-full w-full rounded-tr-3xl border-b-2 bg-gradient-to-b from-transparent from-80%  to-black/50",
          rarity === 5 ? "border-[#ffc870]" : "border-[#c199fd]",
          styles["card"]
        )}
        onMouseLeave={removeListener}
        onMouseMove={rotateToMouse}
      >
        <Image
          className={cn(
            "rounded-tr-3xl bg-gradient-to-b",
            rarity === 5 ? "bg-[#d0aa6e]/[0.7]" : "bg-[#9c65d7]/[0.7]"
          )}
          src={imgUrl}
          alt={avatar_name}
          width={374}
          height={512}
          priority={rarity === 5}
        />
        {damage_type && (
          <ElementIcon
            element={damage_type}
            size="15%"
            className="absolute left-1 top-0"
          />
        )}
        <PathIcon
          path={avatar_base_type}
          size="15%"
          className={cn(
            "absolute left-1 text-white",
            damage_type ? "top-[15%]" : "top-0"
          )}
        />
        <RarityIcon rarity={rarity} className="top-[85%] h-6 w-full" />
        <div ref={glowRef} className={cn("rounded-tr-3xl", styles["glow"])} />
      </div>
    </div>
  );
};
export { CharacterCard };

interface RarityIconProps extends HTMLAttributes<HTMLDivElement> {
  rarity: number;
}
const RarityIcon = forwardRef<HTMLDivElement, RarityIconProps>(
  ({ rarity, className, ...props }, ref) => (
    <div
      className={cn("absolute flex justify-center", className)}
      {...props}
      ref={ref}
    >
      {Array.from(range(1, rarity, 1)).map((_, index) => (
        <div key={index} className="aspect-square">
          <Image
            src="/Star.png"
            height={128}
            width={128}
            alt={rarity + " ✦"}
            className="pointer-events-none"
          />
        </div>
      ))}
    </div>
  )
);
RarityIcon.displayName = "RarityIcon";
