import { DragEventHandler, HTMLAttributes, forwardRef } from "react";
import { RarityIcon } from "@/app/character-db/CharacterCardWrapper";
import { Badge } from "@/app/components/ui/Badge";
import { cn, img } from "@/lib/utils";
import { PathIcon } from "@/app/character-db/PathIcon";
import { ElementIcon } from "@/app/character-db/ElementIcon";
import { useCardConfigController } from "../../ConfigControllerContext";
import { Path } from "@/bindings/AvatarConfig";

interface Props extends HTMLAttributes<HTMLDivElement> {}
export const CharacterInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }: Props, ref) => {
    const { currentCharacter, mihomoResponse, config } =
      useCardConfigController();
    if (!currentCharacter) return null;
    const { name, level, rarity, rank, path, element } = currentCharacter;
    const maxLevel = currentCharacter.promotion * 10 + 20;

    const onImageDrag: DragEventHandler<HTMLDivElement> = (event) => {
      event.stopPropagation();
    };
    const onImageDragEnd: DragEventHandler<HTMLDivElement> = (event) => {
      const clientRect = event.currentTarget.getBoundingClientRect();
      // clientRect.left - event.clientX - refX
      // clientRect.top - event.clientY - refY
    };

    return (
      <div
        className={cn("flex flex-col items-center justify-between", className)}
        ref={ref}
        {...props}
      >
        <div
          id="left-avatar"
          className="absolute top-11 -z-10 flex h-[512px] w-[374px] items-center"
          // TODO: apply to drag
          onClick={(event) => {
            // stop event to bubble to parent element
            event.stopPropagation();
            console.log("child event");
          }}
          onDragOver={(e) => onImageDrag(e)}
          style={{
            backgroundImage: `url(${img(currentCharacter.preview)})`,
            // backgroundPositionX: "right 100px",
            // backgroundPositionY: "bottom 100px",
            backgroundRepeat: "no-repeat",
            boxShadow: "0 0 10px 10px hsl(var(--background)) inset",
          }}
        />

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
              <PathIcon
                path={path.name.replaceAll("The", "").trim() as Path}
                size="30px"
                className="flex-1"
              />
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
              <PathIcon
                path={path.name.replaceAll("The", "").trim() as Path}
                size="30px"
              />
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
