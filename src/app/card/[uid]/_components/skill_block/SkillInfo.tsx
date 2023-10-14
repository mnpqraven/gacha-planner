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
import { useSuspendedCharacterSkill } from "@/hooks/queries/useCharacterSkill";
import { SkillDescription } from "@/app/components/Db/SkillDescription";
import { useAtomValue } from "jotai";
import { charEidAtom, charSkillAtom } from "@/app/card/_store";
import { hoverVerbosityAtom } from "@/app/card/_store/main";

interface Props extends HTMLAttributes<HTMLDivElement> {
  characterId: number;
}

export const SkillInfo = forwardRef<HTMLDivElement, Props>(
  ({ className, characterId, ...props }, ref) => {
    const skList = useAtomValue(charSkillAtom);
    const eidolon = useAtomValue(charEidAtom);

    const { data } = useSuspendedCharacterSkill(characterId);

    return (
      <div
        className={cn(
          className,
          "flex items-center justify-evenly rounded-md border py-2 shadow-md shadow-border"
        )}
        ref={ref}
        {...props}
      >
        {Object.entries(splitGroupByType(data, { technique: false })).map(
          ([type, [first, ...rest]]) => (
            <div key={type} className="flex flex-col items-center">
              <span>{getLabel2(first.skill_type_desc)}</span>
              <SkillIcon
                src={getImagePath(characterId, first)}
                skillInfo={first}
                slv={skList[first.skill_id] ?? 1}
              />
              <span
                className={cn(
                  "w-full text-center font-bold",
                  isImprovedByEidolon(first.attack_type, eidolon)
                    ? "text-[#6cfff7]"
                    : ""
                )}
              >
                {skList[first.skill_id] ==
                getSkillMaxLevel(
                  first.attack_type,
                  first.skill_type_desc,
                  eidolon
                ) ? (
                  <span className="flex items-center justify-end">
                    {skList[first.skill_id] ?? 1}
                    <ChevronsUp className="h-4 w-4 text-green-600" />
                  </span>
                ) : (
                  <span>
                    {skList[first.skill_id] ?? 1} /{" "}
                    {getSkillMaxLevel(
                      first.attack_type,
                      first.skill_type_desc,
                      eidolon
                    )}
                  </span>
                )}
              </span>
            </div>
          )
        )}
      </div>
    );
  }
);
SkillInfo.displayName = "SkillInfo";

interface IconProps {
  src: string | undefined;
  skillInfo: AvatarSkillConfig;
  slv: number;
  width?: number;
  height?: number;
  className?: string;
}
function SkillIcon({
  src,
  skillInfo,
  slv,
  width = 48,
  height = 48,
  className,
}: IconProps) {
  const hoverVerbosity = useAtomValue(hoverVerbosityAtom);

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger disabled={hoverVerbosity === "none"}>
        {src && (
          <Image
            src={src}
            alt={skillInfo.skill_name}
            width={width}
            height={height}
            className={cn("invert dark:invert-0", className)}
          />
        )}
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

function getLabel2(typeDesc: string): string {
  switch (typeDesc) {
    case "Basic ATK":
      return "Basic";
    case "Ultimate":
      return "Ult";
    default:
      return typeDesc;
  }
}
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

type Keys = "basic" | "talent" | "skill" | "ult" | "technique";
type ReturnConfig = Partial<Record<Keys, boolean>>;
type Return = {
  [Key in Keys]?: AvatarSkillConfig[];
};
function splitGroupByType(data: AvatarSkillConfig[], cfg?: ReturnConfig) {
  const _config = {
    basic: true,
    talent: true,
    skill: true,
    ult: true,
    technique: true,
    ...cfg,
  };
  const basic = data.filter((e) => e.attack_type == "Normal");
  const talent = data.filter((e) => e.skill_type_desc == "Talent");
  const skill = data.filter((e) => e.skill_type_desc == "Skill");
  const ult = data.filter((e) => e.skill_type_desc == "Ultimate");
  const technique = data.filter((e) => e.skill_type_desc == "Technique");
  let total: Return = {};
  if (_config?.basic === true) total = { ...total, basic };
  if (_config?.skill === true) total = { ...total, skill };
  if (_config?.talent === true) total = { ...total, talent };
  if (_config?.ult === true) total = { ...total, ult };
  if (_config?.technique === true) total = { ...total, technique };

  return total;
}
