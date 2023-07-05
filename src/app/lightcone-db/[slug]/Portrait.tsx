"use client";

import { LightCone } from "@/bindings/LightConeFull";
import useCardEffect from "@/hooks/animation/useCardEffect";
import { IMAGE_URL } from "@/server/endpoints";
import Image from "next/image";
import "../../character-db/characterCard.css";

type Props = {
  data: LightCone;
};
export function Portrait({ data }: Props) {
  const { metadata } = data;
  const { flowRef, glowRef, removeListener, rotateToMouse } = useCardEffect();

  return (
    <div
      ref={flowRef}
      className="card relative h-fit w-full"
      onMouseLeave={removeListener}
      onMouseMove={rotateToMouse}
    >
      <Image
        src={url(metadata.equipment_id)}
        width={2048}
        height={2048}
        className="place-self-start object-contain"
        alt={metadata.equipment_name}
      />
      <div ref={glowRef} className="glow" />
    </div>
  );
}

function url(id: string | number): string {
  return IMAGE_URL + `image/light_cone_portrait/${id}.png`;
}
