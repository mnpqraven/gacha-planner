"use client";

import { DbCharacter } from "@/bindings/DbCharacter";
import { IMAGE_URL } from "@/server/endpoints";
import Image from "next/image";
import { ElementIcon } from "./ElementIcon";
import { PathIcon } from "./PathIcon";
import { HTMLAttributes, MouseEventHandler, forwardRef, useRef } from "react";
import { cn, range } from "@/lib/utils";
import "./characterCard.css";

const CharacterCard = ({ data }: { data: DbCharacter }) => {
  const { rarity, id, element, path, name } = data;
  let bounds: DOMRect | undefined = undefined;
  const inputRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rotateToMouse: MouseEventHandler<HTMLDivElement> = (e) => {
    bounds = inputRef.current?.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - (bounds?.x ?? 0);
    const topY = mouseY - (bounds?.y ?? 0);
    const center = {
      x: leftX - (bounds?.width ?? 0) / 2,
      y: topY - (bounds?.height ?? 0) / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    if (inputRef.current) {
      inputRef.current.style.transform = `
      scale3d(1.07, 1.07, 1.07)
      rotate3d(
        ${center.y / 100},
        ${-center.x / 100},
        0,
        ${Math.log(distance) * 2}deg
      )
    `;
    }

    if (glowRef.current) {
      glowRef.current.style.backgroundImage = `
      radial-gradient(
        circle at
        ${center.x * 2 + (bounds?.width ?? 0) / 2}px
        ${center.y * 2 + (bounds?.height ?? 0) / 2}px,
        #ffffff55,
        #0000000f
      )
    `;
    }
  };
  const removeListener: MouseEventHandler<HTMLDivElement> = (e) => {
    if (inputRef.current) {
      inputRef.current.style.transform = "";
      inputRef.current.style.background = "";
    }
  };
  return (
    <div style={{ perspective: "1500px" }}>
      <div
        ref={inputRef}
        className={cn(
          "card relative h-full w-full rounded-tr-3xl border-b-2 bg-gradient-to-b from-transparent from-80%  to-black/50",
          rarity === 5 ? "border-[#ffc870]" : "border-[#c199fd]"
        )}
        onMouseLeave={removeListener}
        onMouseMove={(e) => rotateToMouse(e)}
      >
        <Image
          className={cn(
            "rounded-tr-3xl bg-gradient-to-b",
            rarity === 5 ? "bg-[#d0aa6e]/[0.7]" : "bg-[#9c65d7]/[0.7]"
          )}
          src={url(id)}
          alt={name}
          width={374}
          height={512}
          priority={rarity === 5}
        />
        <ElementIcon
          element={element}
          size="15%"
          className="absolute left-1 top-0"
        />
        <PathIcon
          path={path}
          size="15%"
          className="absolute left-1 top-[15%] text-white"
        />
        <RarityIcon rarity={rarity} className="top-[85%] h-6" />
        <div ref={glowRef} className="glow rounded-tr-3xl" />
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

function url(id: string | number): string {
  return IMAGE_URL + `image/character_preview/${id}.png`;
}
