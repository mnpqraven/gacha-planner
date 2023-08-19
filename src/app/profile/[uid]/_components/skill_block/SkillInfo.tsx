import { HTMLAttributes, forwardRef } from "react";
import { SkillType } from "@/bindings/AvatarSkillConfig";
import { cn, img } from "@/lib/utils";
import Image from "next/image";
import { useCardConfigController } from "../../ConfigControllerContext";

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
        className={cn(className, "flex items-center justify-center gap-2")}
        ref={ref}
        {...props}
      >
        {skills.map(({ icon, id, level: slv, type }) => (
          <div key={id} className="flex flex-col items-center">
            <span className="mb-1">{getLabel(type)}</span>
            <Image src={img(icon)} alt="" height={48} width={48} />
            <span
              className={cn(
                isImprovedByEidolon(type, eidolon) ? "text-[#6cfff7]" : "",
                "font-bold"
              )}
            >
              {slv} / {getSkillMaxLevel(type, eidolon)}
            </span>
          </div>
        ))}
      </div>
    );
  }
);
SkillInfo.displayName = "SkillInfo";

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
