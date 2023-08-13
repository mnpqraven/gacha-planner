import { HTMLAttributes, forwardRef, useContext } from "react";
import { CardConfigContext } from "../../ConfigController";
import { RarityIcon } from "@/app/character-db/CharacterCard";
import { Badge } from "@/app/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const CharacterInfo = forwardRef<HTMLDivElement, Props>(
  ({ className }: Props, ref) => {
    const { currentCharacter, player } = useContext(CardConfigContext);
    if (!currentCharacter) return null;
    const { name, level, rarity, rank } = currentCharacter;
    const maxLevel = currentCharacter.promotion * 10 + 20;

    return (
      <div
        className={cn("flex flex-col items-center justify-between", className)}
        ref={ref}
      >
        <div className="grid grid-cols-3 w-full">
          <div className="flex flex-col">
            <span className="font-bold">{player?.nickname}</span>
            <span>{player?.uid}</span>
          </div>

          <div className="flex flex-col place-self-center">
            <div className="font-bold">{name}</div>
            <div>
              <span className="font-bold">Lv. {level}</span>/{maxLevel}
            </div>
            <div>
              <Badge
                className="rounded-none"
                style={{
                  clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)",
                }}
              >
                Eidolon {rank}
              </Badge>
            </div>
          </div>

          <div />
        </div>

        <RarityIcon
          id="rarity"
          rarity={rarity}
          className="static h-12 w-full"
        />
      </div>
    );
  }
);

CharacterInfo.displayName = "CharacterInfo";
