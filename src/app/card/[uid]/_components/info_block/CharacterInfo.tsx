import { HTMLAttributes, forwardRef, useMemo } from "react";
import { RarityIcon } from "@/app/character-db/CharacterCardWrapper";
import { Badge } from "@/app/components/ui/Badge";
import { cn, img } from "@/lib/utils";
import { PathIcon } from "@/app/character-db/PathIcon";
import { ElementIcon } from "@/app/character-db/ElementIcon";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { useAtomValue } from "jotai";
import {
  charEidAtom,
  charLevelAtom,
  charPromotionAtom,
  configAtom,
} from "@/app/card/_store";
import { Element, Path } from "@/bindings/AvatarConfig";
import { selectAtom } from "jotai/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
}

export const CharacterInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, characterId, ...props }: Props, ref) => {
    const { data } = useCharacterMetadata(characterId);
    const level = useAtomValue(charLevelAtom);
    const ascension = useAtomValue(charPromotionAtom);
    const eidolon = useAtomValue(charEidAtom);

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
          <UserPlateLeft path={data.avatar_base_type} />

          <div className="flex flex-col place-self-center">
            <div className="font-bold">{data.avatar_name}</div>
            <div>
              <span className="font-bold">Lv. {level}</span>/{maxLevel}
            </div>

            <div>
              <Badge>Eidolon {eidolon}</Badge>
            </div>
          </div>

          <UserPlateRight
            path={data.avatar_base_type}
            element={data.damage_type}
          />
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

function UserPlateLeft({ path }: { path: Path }) {
  const playerInfoAtom = useMemo(
    () => selectAtom(configAtom, (atom) => atom.showPlayerInfo),
    []
  );
  const playerNameAtom = useMemo(
    () => selectAtom(configAtom, (atom) => atom.name),
    []
  );
  const showPlayerInfo = useAtomValue(playerInfoAtom);
  const name = useAtomValue(playerNameAtom);
  if (showPlayerInfo)
    return (
      <div className="flex flex-col">
        <span className="font-bold">{name}</span>
        {/* <span>{config.uid}</span> */}
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-end">
      <PathIcon path={path} size="30px" className="flex-1" />
      <Badge>{path}</Badge>
    </div>
  );
}
function UserPlateRight({ path, element }: { path: Path; element: Element }) {
  const playerInfoAtom = useMemo(
    () => selectAtom(configAtom, (atom) => atom.showPlayerInfo),
    []
  );
  const showPlayerInfo = useAtomValue(playerInfoAtom);
  if (showPlayerInfo)
    return (
      <div className="relative flex justify-evenly">
        <div className="absolute bottom-0 h-full w-[1px] rotate-45 border"></div>
        <PathIcon path={path} size="30px" />
        <ElementIcon element={element} size="30px" className="self-end" />
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-end">
      <ElementIcon element={element} size="30px" className="flex-1" />
      <Badge>{element}</Badge>
    </div>
  );
}
