import { ButtonHTMLAttributes, forwardRef } from "react";
import { MihomoResponse } from "./types";
import { Button } from "../components/ui/Button";
import Image from "next/image";
import { cn, img } from "@/lib/utils";
import { Separator } from "../components/ui/Separator";
import Link from "next/link";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  data: MihomoResponse;
  uid: string;
  lang: string;
}
export const PlayerCard = forwardRef<HTMLButtonElement, Props>(
  ({ data, uid, lang, className, ...props }, ref) => {
    const { player } = data;
    return (
      <Button
        className={cn("flex h-fit items-center gap-2.5", className)}
        variant="outline"
        ref={ref}
        {...props}
        asChild
      >
        <Link href={`profile/${uid}?lang=${lang}`}>
          <Image
            src={img(player.avatar.icon)}
            alt={player.avatar.name}
            height={84}
            width={84}
          />

          <div className="flex flex-col">
            <div className="flex justify-between gap-2">
              <span>{player.nickname}</span>
              <span>Level {player.level}</span>
              <span>EQ {player.world_level}</span>
            </div>

            <Separator className="my-1.5" />

            {player.signature !== "" && (
              <>
                <span>{player.signature}</span>

                <Separator className="my-1.5" />
              </>
            )}

            <div className="flex justify-between gap-2">
              <span>Characters: {player.space_info.avatar_count}</span>
              <span>Achievements: {player.space_info.achievement_count}</span>
            </div>
          </div>
        </Link>
      </Button>
    );
  }
);
PlayerCard.displayName = "PlayerCard";
