import { cn, img } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import Image from "next/image";
import { ImpositionIcon } from "../ImpositionIcon";
import { useCardConfigController } from "../../ConfigControllerContext";
import { useLightConeSkill } from "@/hooks/queries/useLightConeSkill";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { SkillDescription } from "@/app/components/Db/SkillDescription";
import { MihomoCharacter } from "@/app/profile/types";
import { CardConfig } from "../../configReducer";

interface Props extends HTMLAttributes<HTMLDivElement> {
  displayStat?: boolean;
  lcId: number | string;
  characterData: MihomoCharacter;
  config: CardConfig;
}
export const LightConeInfo = forwardRef<HTMLDivElement, Props>(
  (
    { displayStat = false, lcId, characterData, config, className, ...props },
    ref
  ) => {
    const ratio = 902 / 1260;
    const { skill } = useLightConeSkill(
      characterData ? Number(lcId) : undefined
    );

    if (!characterData) return null;

    const { light_cone } = characterData;
    const { rank, name, level, portrait, attributes } = light_cone;
    const maxLevel = light_cone.promotion * 10 + 20;

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
            <ImpositionIcon imposition={rank} className="ml-2.5" />
          </span>

          {displayStat && (
            <div className="flex">
              {attributes.map((attr) => (
                <div key={attr.field} className="flex items-center">
                  <Image src={img(attr.icon)} alt="" width={32} height={32} />
                  {attr.display}
                </div>
              ))}
            </div>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger disabled={config.hoverVerbosity === "none"}>
            <Image
              src={img(portrait)}
              alt=""
              width={350 * ratio}
              height={350}
              className="justify-self-end shadow-xl shadow-border"
            />
          </TooltipTrigger>
          {config.hoverVerbosity !== "none" && !!skill && (
            <TooltipContent className="w-96 text-base" side="left">
              <p className="mb-2 font-bold text-accent-foreground">
                {skill.skill_name}
              </p>

              <SkillDescription
                skillDesc={skill.skill_desc}
                paramList={skill.param_list}
                slv={rank - 1}
              />
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    );
  }
);
LightConeInfo.displayName = "LightConeInfo";
