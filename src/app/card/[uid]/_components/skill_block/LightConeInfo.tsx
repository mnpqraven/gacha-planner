import { cn, img } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { ImpositionIcon } from "../ImpositionIcon";
import { useLightConeSkill } from "@/hooks/queries/useLightConeSkill";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { SkillDescription } from "@/app/components/Db/SkillDescription";
import { useLightConeMetadata } from "@/hooks/queries/useLightConeMetadata";
import { useAtomValue } from "jotai";
import {
  lcIdAtom,
  lcImpositionAtom,
  lcLevelAtom,
  lcPromotionAtom,
} from "@/app/card/_store";
import { hoverVerbosityAtom } from "@/app/card/_store/main";

interface Props extends HTMLAttributes<HTMLDivElement> {
  displayStat?: boolean;
}
export const LightConeInfo = forwardRef<HTMLDivElement, Props>(
  ({ displayStat = false, className, ...props }, ref) => {
    const ratio = 902 / 1260;

    const lightConeId = useAtomValue(lcIdAtom);
    const { data: skill } = useLightConeSkill(lightConeId);
    const { lightCone } = useLightConeMetadata(lightConeId);

    const level = useAtomValue(lcLevelAtom);
    const ascension = useAtomValue(lcPromotionAtom);
    const imposition = useAtomValue(lcImpositionAtom);

    const hoverVerbosity = useAtomValue(hoverVerbosityAtom);

    if (!lightCone) return null;

    const { equipment_name: name } = lightCone;
    const maxLevel = ascension * 10 + 20;

    if (!lightConeId) return null;

    return (
      <div
        className={cn("flex flex-col items-center", className)}
        ref={ref}
        {...props}
      >
        <div className="flex h-[72px] flex-col items-center">
          <span className="font-bold">{name}</span>

          <span className="flex">
            <span className="font-bold">Lv. {level}</span> / {maxLevel}
            <ImpositionIcon imposition={imposition} className="ml-2.5" />
          </span>

          {/*displayStat && (
            <div className="flex">
              {attributes.map((attr) => (
                <div key={attr.field} className="flex items-center">
                  <Image src={img(attr.icon)} alt="" width={32} height={32} />
                  {attr.display}
                </div>
              ))}
            </div>
          )*/}
        </div>

        <Tooltip>
          <TooltipTrigger disabled={hoverVerbosity === "none"}>
            <Image
              src={img(`image/light_cone_portrait/${lightConeId}.png`)}
              alt=""
              width={350 * ratio}
              height={350}
              className="justify-self-end shadow-xl shadow-border"
            />
          </TooltipTrigger>
          {hoverVerbosity !== "none" && !!skill && (
            <TooltipContent className="w-96 text-base" side="left">
              <p className="mb-2 font-bold text-accent-foreground">
                {skill.skill_name}
              </p>

              <SkillDescription
                skillDesc={skill.skill_desc}
                paramList={skill.param_list}
                slv={imposition - 1}
              />
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    );
  }
);
LightConeInfo.displayName = "LightConeInfo";
