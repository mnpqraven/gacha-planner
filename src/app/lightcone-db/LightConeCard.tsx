"use client";

import Image from "next/image";
import { ElementIcon } from "../character-db/ElementIcon";
import { PathIcon } from "../character-db/PathIcon";
import { HTMLAttributes, MouseEventHandler, forwardRef, useRef } from "react";
import { cn, range } from "@/lib/utils";
import "../character-db/characterCard.css";
import { Path } from "@/bindings/LightConeFull";
import { Element } from "@/bindings/PatchBanner";

type Props = {
  rarity: number;
  element?: Element;
  path: Path;
  name: string;
  imgUrl: string;
};

const LightConeCard = ({ rarity, element, path, name, imgUrl }: Props) => {
  let bounds: DOMRect | undefined = undefined;
  const flowRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const rotateToMouse: MouseEventHandler<HTMLDivElement> = (e) => {
    bounds = flowRef.current?.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - (bounds?.x ?? 0);
    const topY = mouseY - (bounds?.y ?? 0);
    const center = {
      x: leftX - (bounds?.width ?? 0) / 2,
      y: topY - (bounds?.height ?? 0) / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    if (flowRef.current) {
      flowRef.current.style.transform = `
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
  const removeListener: MouseEventHandler<HTMLDivElement> = (_) => {
    if (flowRef.current) {
      flowRef.current.style.transform = "";
      flowRef.current.style.background = "";
    }
  };
  return (
    <div style={{ perspective: "1500px" }}>
      <div
        ref={flowRef}
        className="relative h-full w-full bg-gradient-to-b from-transparent from-80% to-black/50"
        onMouseLeave={removeListener}
        onMouseMove={(e) => rotateToMouse(e)}
      >
        <div className="card absolute left-[18%] top-[14%] h-[76%] w-[65%] rotate-[13deg]">
          <div ref={glowRef} className="glow" />
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
        <PathIcon
          path={path}
          size="15%"
          className={cn(
            "absolute left-1 text-white",
            element ? "top-[15%]" : "top-0"
          )}
        />
      <RarityIcon rarity={rarity} className="-my-4 h-6 w-full" />
    </div>
  );
};
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
