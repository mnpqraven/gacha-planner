import { HTMLAttributes, forwardRef } from "react";
import { AvatarSkillConfig, SkillType } from "@/bindings/AvatarSkillConfig";
import { cn, getImagePath } from "@/lib/utils";
import Image from "next/image";
import { ChevronsUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { useCharacterSkill } from "@/hooks/queries/useCharacterSkill";
import { SkillDescription } from "@/app/components/Db/SkillDescription";
import { useAtomValue } from "jotai";
import { configAtom } from "@/app/card/_store";

const DISPLAY_SKILL_TYPES: SkillType[] = [
  "Talent",
  "Normal",
  "BPSkill",
  "Ultra",
];

interface Props extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
  eidolon: number;
  // skill id: slv
  skills: Record<number, number>;
}

export const SkillInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, characterId, eidolon, skills: skList, ...props }, ref) => {
    const { data } = useCharacterSkill(characterId);

    const skills = data
      .filter(
        ({ attack_type }) =>
          attack_type !== "MazeNormal" && attack_type !== "Maze"
      )
      .sort((a, b) => {
        const toInt = (
          ttype: SkillType | null | undefined,
          typeDesc: string
        ) => {
          if (ttype === "Maze") return 4;
          if (ttype === "Ultra") return 3;
          if (ttype === "BPSkill") return 2;
          if (ttype === "Talent" || typeDesc === "Talent") return 1;
          return 0;
        };
        return (
          toInt(a.attack_type, a.skill_type_desc) -
          toInt(b.attack_type, b.skill_type_desc)
        );
      })
      .slice(-4);

    return (
      <div
        className={cn(
          className,
          "flex items-center justify-evenly rounded-md border py-2 shadow-md shadow-border"
        )}
        ref={ref}
        {...props}
      >
        {skills.map((skillInfo) => (
          <div key={skillInfo.skill_id} className="flex flex-col items-center">
            <span>
              {getLabel(
                skillInfo.skill_type_desc == "Talent"
                  ? skillInfo.skill_type_desc
                  : skillInfo.attack_type
              )}
            </span>
            <SkillIcon
              src={`${getImagePath(characterId, skillInfo)}`}
              skillInfo={skillInfo}
              slv={skList[skillInfo.skill_id]}
            />

            <span
              className={cn(
                "w-full text-center font-bold",
                isImprovedByEidolon(skillInfo.attack_type, eidolon)
                  ? "text-[#6cfff7]"
                  : ""
              )}
            >
              {skList[skillInfo.skill_id] ==
              getSkillMaxLevel(
                skillInfo.attack_type,
                skillInfo.skill_type_desc,
                eidolon
              ) ? (
                <span className="flex items-center justify-end">
                  {skList[skillInfo.skill_id] ?? 1}
                  <ChevronsUp className="h-4 w-4 text-green-600" />
                </span>
              ) : (
                <span>
                  {skList[skillInfo.skill_id] ?? 1} /{" "}
                  {getSkillMaxLevel(
                    skillInfo.attack_type,
                    skillInfo.skill_type_desc,
                    eidolon
                  )}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }
);
SkillInfo.displayName = "SkillInfo";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  skillInfo: AvatarSkillConfig;
  slv: number;
  width?: number;
  height?: number;
}
const SkillIcon = forwardRef<HTMLDivElement, IconProps>(
  (
    { src, skillInfo, slv, width = 48, height = 48, className, ...props },
    ref
  ) => {
    const config = useAtomValue(configAtom);
    const { hoverVerbosity } = config;

    return (
      <Tooltip>
        <TooltipTrigger disabled={hoverVerbosity === "none"}>
          <Image
            src={src}
            alt={skillInfo.skill_name}
            width={width}
            height={height}
            className="invert dark:invert-0"
          />
        </TooltipTrigger>
        {hoverVerbosity === "simple" ? (
          <TooltipContent>{skillInfo.skill_name}</TooltipContent>
        ) : hoverVerbosity === "detailed" ? (
          <TooltipContent className="w-96 py-2 text-justify text-base">
            <p className="mb-2 text-base font-bold text-accent-foreground">
              {skillInfo.skill_name}
            </p>

            <SkillDescription
              skillDesc={skillInfo.skill_desc}
              paramList={skillInfo.param_list}
              slv={slv}
            />
          </TooltipContent>
        ) : null}
      </Tooltip>
    );
  }
);
SkillIcon.displayName = "SkillIcon ";

function getLabel(skillType: SkillType | null | undefined): string {
  switch (skillType) {
    case "Normal":
      return "Basic";
    case "BPSkill":
      return "Skill";
    case "Ultra":
      return "Ult";
    case "Talent":
      return "Talent";
    default:
      return "";
  }
}

export function getSkillMaxLevel(
  skillType: SkillType | null | undefined,
  skillTypeDesc: string,
  eidolon: number
): number {
  if (skillTypeDesc == "Talent") return eidolon >= 5 ? 15 : 10;
  switch (skillType) {
    case "Normal":
      return eidolon >= 3 ? 10 : 6;
    case "BPSkill":
      return eidolon >= 3 ? 15 : 10;
    case "Ultra":
    case "Talent":
      return eidolon >= 5 ? 15 : 10;
    default:
      return 1;
  }
}

function isImprovedByEidolon(
  type: SkillType | null | undefined,
  eidolon: number
): boolean {
  if (!type) return false;
  if (["Normal", "BPSkill"].includes(type) && eidolon >= 3) return true;
  if (["Ultra", "Talent"].includes(type) && eidolon >= 5) return true;
  return false;
}
