import { AvatarConfig } from "@/bindings/AvatarConfig";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/Dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/Tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { elementVariant } from "@/lib/variants";
import { CharacterTabWrapper } from "../components/Character/CharacterTabWrapper";

interface Props {
  data: AvatarConfig;
}
function CharacterIcon({ data: avatar }: Props) {
  return (
    <div key={avatar.avatar_id} className="flex flex-col">
      <p className="whitespace-pre-wrap text-center"></p>
      <div className="flex gap-2.5">
        <Dialog>
          <DialogTrigger>
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/character/${avatar.avatar_id}.png`}
                  alt=""
                  className={cn(
                    "h-12 w-12 rounded-full border",
                    elementVariant({ border: avatar.damage_type })
                  )}
                  width={128}
                  height={128}
                />
              </TooltipTrigger>
              <TooltipContent>
                {avatar.avatar_name} - {avatar.rarity} ✦{" "}
                {avatar.avatar_base_type}
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent className="min-h-[16rem] sm:max-w-4xl">
            {avatar.avatar_id && (
              <CharacterTabWrapper characterId={avatar.avatar_id} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
export { CharacterIcon };
