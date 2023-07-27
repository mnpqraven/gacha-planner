"use client";

import Image from "next/image";
import { ElementIcon } from "../character-db/ElementIcon";
import { PathIcon } from "../character-db/PathIcon";
import { HTMLAttributes, forwardRef } from "react";
import { cn, range } from "@/lib/utils";
import styles from "@/css/floating-card.module.css";
import { Element } from "@/bindings/PatchBanner";
import useCardEffect from "@/hooks/animation/useCardEffect";
import { Path } from "@/bindings/AvatarConfig";

interface Props extends HTMLAttributes<HTMLDivElement> {
  rarity?: number;
  element?: Element;
  path?: Path;
  name: string;
  imgUrl: string;
}

const LightConeCard = forwardRef<HTMLDivElement, Props>(
  ({ rarity, element, path, name, imgUrl, className, ...props }, ref) => {
    const { flowRef, glowRef, removeListener, rotateToMouse } = useCardEffect();
    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <div
          ref={flowRef}
          className="relative h-full w-full transition-all ease-out"
          onMouseLeave={removeListener}
          onMouseMove={rotateToMouse}
          style={{ perspective: "1500px" }}
        >
          <div
            className={cn(
              "absolute left-[18%] top-[14%] h-[76%] w-[65%] rotate-[13deg]",
              styles["card"]
            )}
          >
            <div ref={glowRef} className={styles["glow"]} />
          </div>
          <Image
            src={imgUrl}
            alt={name}
            width={374}
            height={512}
            priority={rarity === 5}
          />
          {element && (
            <ElementIcon
              element={element}
              size="15%"
              className="absolute left-1 top-0"
            />
          )}
        </div>
        {path && (
          <PathIcon
            path={path}
            size="15%"
            className={cn(
              "absolute left-1 text-white",
              element ? "top-[15%]" : "top-0"
            )}
          />
        )}
        {rarity && <RarityIcon rarity={rarity} className="-my-4 h-6 w-full" />}
      </div>
    );
  }
);
LightConeCard.displayName = "LightConeCard";

export { LightConeCard };

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
