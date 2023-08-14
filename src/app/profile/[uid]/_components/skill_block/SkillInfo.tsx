import { HTMLAttributes, forwardRef, useContext } from "react";
import { SkillType } from "@/bindings/AvatarSkillConfig";
import { cn, img } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/app/components/ui/Badge";
import { CardConfigContext } from "../../ConfigControllerContext";

const DISPLAY_SKILL_TYPES: SkillType[] = [
  "Talent",
  "Normal",
  "BPSkill",
  "Ultra",
];

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const SkillInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    const { currentCharacter } = useContext(CardConfigContext);

    if (!currentCharacter) return null;

    const { rank: eidolon } = currentCharacter;

    const skills = currentCharacter.skills.filter((e) =>
      DISPLAY_SKILL_TYPES.includes(e.type)
    );

    return (
      <div
        className={cn(
          className,
          "flex flex-col items-center justify-center pt-[72px]"
        )}
        ref={ref}
        {...props}
      >
        {skills.map(({ icon, id, level: slv, type }) => (
          <div key={id} className="flex flex-col items-center">
            <Badge className="w-fit">{type}</Badge>
            <Image src={img(icon)} alt="" height={48} width={48} />
            <span
              className={cn(
                isImprovedByEidolon(type, eidolon) ? "text-blue-300" : "",
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
