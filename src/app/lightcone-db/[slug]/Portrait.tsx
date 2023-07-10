"use client";

import { LightCone } from "@/bindings/LightConeFull";
import useCardEffect from "@/hooks/animation/useCardEffect";
import { IMAGE_URL } from "@/server/endpoints";
import Image from "next/image";
import styles from "@/css/floating-card.module.css";
import { cn } from "@/lib/utils";

type Props = {
  data: LightCone;
};
export function Portrait({ data }: Props) {
  const { metadata } = data;
  const { flowRef, glowRef, removeListener, rotateToMouse } = useCardEffect();

  return (
    <div
      ref={flowRef}
      className={cn("relative h-fit w-full", styles.card)}
      onMouseLeave={removeListener}
      onMouseMove={rotateToMouse}
    >
      <Image
        src={url(metadata.equipment_id)}
        width={902}
        height={1260}
        className="place-self-start object-contain"
        alt={metadata.equipment_name}
      />
      <div ref={glowRef} className={styles.glow} />
    </div>
  );
}

function url(id: string | number): string {
  return IMAGE_URL + `image/light_cone_portrait/${id}.png`;
}
