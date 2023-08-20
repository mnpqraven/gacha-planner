import { HTMLAttributes, forwardRef } from "react";
import { RarityIcon } from "@/app/character-db/CharacterCardWrapper";
import { Badge } from "@/app/components/ui/Badge";
import { cn } from "@/lib/utils";
import { PathIcon } from "@/app/character-db/PathIcon";
import { ElementIcon } from "@/app/character-db/ElementIcon";
import { useCardConfigController } from "../../ConfigControllerContext";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const CharacterInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }: Props, ref) => {
    const { currentCharacter, mihomoResponse, config } =
      useCardConfigController();
    if (!currentCharacter) return null;
    const { name, level, rarity, rank, path, element } = currentCharacter;
    const maxLevel = currentCharacter.promotion * 10 + 20;

    return (
      <div
        className={cn("flex flex-col items-center justify-between", className)}
        ref={ref}
        {...props}
      >
        <div className="grid w-full grid-cols-3">
          {config.showPlayerInfo ? (
            <div className="flex flex-col">
              <span className="font-bold">
                {mihomoResponse?.player.nickname}
              </span>
              <span>{mihomoResponse?.player.uid}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-end">
              <PathIcon path={path.name} size="30px" className="flex-1" />
              <Badge>{path.name}</Badge>
            </div>
          )}

          <div className="flex flex-col place-self-center">
            <div className="font-bold">{name}</div>
            <div>
              <span className="font-bold">Lv. {level}</span>/{maxLevel}
            </div>

            <div>
              <Badge>Eidolon {rank}</Badge>
            </div>
          </div>

          {config.showPlayerInfo ? (
            <div className="relative flex justify-evenly">
              <div className="absolute bottom-0 h-full w-[1px] rotate-45 border"></div>
              <PathIcon path={path.name} size="30px" />
              <ElementIcon
                element={element.name}
                size="30px"
                className="self-end"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-end">
              <ElementIcon
                element={element.name}
                size="30px"
                className="flex-1"
              />
              <Badge>{element.name}</Badge>
            </div>
          )}
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
