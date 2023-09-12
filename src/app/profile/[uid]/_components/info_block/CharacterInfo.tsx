import { HTMLAttributes, forwardRef } from "react";
import { RarityIcon } from "@/app/character-db/CharacterCardWrapper";
import { Badge } from "@/app/components/ui/Badge";
import { cn, img } from "@/lib/utils";
import { PathIcon } from "@/app/character-db/PathIcon";
import { ElementIcon } from "@/app/character-db/ElementIcon";
import { MihomoPlayer } from "@/app/profile/types";
import { CardConfig } from "../../configReducer";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";

interface Props extends HTMLAttributes<HTMLDivElement> {
  playerData?: MihomoPlayer;
  characterId: number;
  config: CardConfig;
  level: number;
  ascension: number;
  eidolon: number;
}

export const CharacterInfo = forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      characterId,
      config,
      level,
      ascension,
      eidolon,
      playerData,
      ...props
    }: Props,
    ref
  ) => {
    const { data } = useCharacterMetadata(characterId);
    if (!data) return null;

    // const { name, level, rarity, rank, path, element } = characterData;
    const maxLevel = ascension * 10 + 20;

    // const onImageDrag: DragEventHandler<HTMLDivElement> = (event) => {
    //   event.stopPropagation();
    // };
    // const onImageDragEnd: DragEventHandler<HTMLDivElement> = (event) => {
    //   const clientRect = event.currentTarget.getBoundingClientRect();
    //   // clientRect.left - event.clientX - refX
    //   // clientRect.top - event.clientY - refY
    // };

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
          // onClick={(event) => {
          //   // stop event to bubble to parent element
          //   event.stopPropagation();
          //   console.log("child event");
          // }}
          // onDragOver={onImageDrag}
          style={{
            backgroundImage: `url(${img(
              `image/character_preview/${characterId}.png`
            )})`,
            // backgroundPositionX: "right 100px",
            // backgroundPositionY: "bottom 100px",
            backgroundRepeat: "no-repeat",
            boxShadow: "0 0 10px 10px hsl(var(--background)) inset",
          }}
        />

        <div className="grid w-full grid-cols-3">
          {config.showPlayerInfo ? (
            <div className="flex flex-col">
              <span className="font-bold">{playerData?.nickname}</span>
              <span>{playerData?.uid}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-end">
              <PathIcon
                path={data.avatar_base_type}
                size="30px"
                className="flex-1"
              />
              <Badge>{data.avatar_base_type}</Badge>
            </div>
          )}

          <div className="flex flex-col place-self-center">
            <div className="font-bold">{data.avatar_name}</div>
            <div>
              <span className="font-bold">Lv. {level}</span>/{maxLevel}
            </div>

            <div>
              <Badge>Eidolon {eidolon}</Badge>
            </div>
          </div>

          {config.showPlayerInfo ? (
            <div className="relative flex justify-evenly">
              <div className="absolute bottom-0 h-full w-[1px] rotate-45 border"></div>
              <PathIcon path={data.avatar_base_type} size="30px" />
              <ElementIcon
                element={data.damage_type}
                size="30px"
                className="self-end"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-end">
              <ElementIcon
                element={data.damage_type}
                size="30px"
                className="flex-1"
              />
              <Badge>{data.damage_type}</Badge>
            </div>
          )}
        </div>

        <RarityIcon
          id="rarity"
          rarity={data.rarity}
          className="static h-12 w-full"
        />
      </div>
    );
  }
);

CharacterInfo.displayName = "CharacterInfo";
