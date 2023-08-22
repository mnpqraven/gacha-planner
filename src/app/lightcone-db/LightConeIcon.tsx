import { EquipmentConfig } from "@/bindings/EquipmentConfig";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/Dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/Tooltip";
import Image from "next/image";

interface Props {
  data: EquipmentConfig;
}

function LightConeIcon({ data: lc }: Props) {
  return (
    <div key={lc.equipment_id} className="flex flex-col">
      <p className="whitespace-pre-wrap text-center"></p>
      <div className="flex gap-2.5">
        <Dialog>
          <Tooltip>
            <DialogTrigger asChild>
              <TooltipTrigger>
                <Image
                  src={`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/light_cone/${lc.equipment_id}.png`}
                  alt=""
                  className="h-12 w-12"
                  width={48}
                  height={48}
                />
              </TooltipTrigger>
            </DialogTrigger>

            <TooltipContent>
              {lc.equipment_name} - {lc.rarity} ✦
            </TooltipContent>
          </Tooltip>

          <DialogContent className="min-h-[16rem] sm:max-w-4xl">
            {/* lc.avatar_id && (
              <CharacterTabWrapper characterId={lc.avatar_id} />
            ) */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
export { LightConeIcon };
