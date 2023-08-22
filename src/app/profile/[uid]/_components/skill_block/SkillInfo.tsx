import { HTMLAttributes, forwardRef } from "react";
import { SkillType } from "@/bindings/AvatarSkillConfig";
import { cn, img } from "@/lib/utils";
import Image from "next/image";
import { useCardConfigController } from "../../ConfigControllerContext";
import { ChevronsUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/Tooltip";
import { MihomoSkillConfig } from "@/app/profile/types";

const DISPLAY_SKILL_TYPES: SkillType[] = [
  "Talent",
  "Normal",
  "BPSkill",
  "Ultra",
];

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const SkillInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useCardConfigController();

    if (!currentCharacter) return null;

    const { rank: eidolon } = currentCharacter;

    const skills = currentCharacter.skills
      .filter((e) => DISPLAY_SKILL_TYPES.includes(e.type))
      .slice(0, 4);

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
          <div key={skillInfo.id} className="flex flex-col items-center">
            <span>{getLabel(skillInfo.type)}</span>
            <SkillIcon src={img(skillInfo.icon)} skillInfo={skillInfo} />
            <span
              className={cn(
                "w-full text-center font-bold",
                isImprovedByEidolon(skillInfo.type, eidolon)
                  ? "text-[#6cfff7]"
                  : ""
              )}
            >
              {skillInfo.level == getSkillMaxLevel(skillInfo.type, eidolon) ? (
                <span className="flex items-center justify-end">
                  {skillInfo.level}
                  <ChevronsUp className="h-4 w-4 text-green-600" />
                </span>
              ) : (
                <span>
                  {skillInfo.level} /{" "}
                  {getSkillMaxLevel(skillInfo.type, eidolon)}
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
  skillInfo: MihomoSkillConfig;
  width?: number;
  height?: number;
}
const SkillIcon = forwardRef<HTMLDivElement, IconProps>(
  ({ src, skillInfo, width = 48, height = 48, className, ...props }, ref) => {
    const { config } = useCardConfigController();
    const { hoverVerbosity } = config;

    return (
      <Tooltip>
        <TooltipTrigger disabled={hoverVerbosity === "none"}>
          <Image
            src={src}
            alt={skillInfo.name}
            width={width}
            height={height}
            className="invert dark:invert-0"
          />
        </TooltipTrigger>
        {hoverVerbosity === "simple" ? (
          <TooltipContent>{skillInfo.name}</TooltipContent>
        ) : hoverVerbosity === "detailed" ? (
          <TooltipContent className="w-96 py-2 text-justify text-base">
            <p className="mb-2 text-base font-bold text-accent-foreground">
              {skillInfo.name}
            </p>
            {skillInfo.desc}
          </TooltipContent>
        ) : null}
      </Tooltip>
    );
  }
);
SkillIcon.displayName = "SkillIcon ";

function getLabel(skillType: SkillType): string {
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

function getSkillMaxLevel(skillType: SkillType, eidolon: number): number {
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

function isImprovedByEidolon(type: SkillType, eidolon: number): boolean {
  if (["Normal", "BPSkill"].includes(type) && eidolon >= 3) return true;
  if (["Ultra", "Talent"].includes(type) && eidolon >= 5) return true;
  return false;
}
