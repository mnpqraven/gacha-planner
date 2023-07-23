"use client";

import Image from "next/image";
import { useState } from "react";
import { Slider } from "../ui/Slider";
import { cn, parseSkillType } from "@/lib/utils";
import { Toggle } from "../ui/Toggle";
import { Separator } from "../ui/Separator";
import { SkillDescription } from "../Db/SkillDescription";
import { AvatarSkillConfig, SkillType } from "@/bindings/AvatarSkillConfig";

type Props = {
  skills: AvatarSkillConfig[];
  characterId: number;
  maxEnergy: number;
};
const SkillOverview = ({ skills, characterId, maxEnergy }: Props) => {
  const [selectedSkill, setSelectedSkill] = useState<AvatarSkillConfig>(
    skills.find((e) => e.skill_type_desc === "Talent") ?? skills[0]
  );
  const [selectedSlv, setSelectedSlv] = useState(0);

  const sortedSkills = skills
    .filter(
      (skill) =>
        skill.attack_type !== "Normal" && skill.attack_type !== "MazeNormal"
    )
    .sort((a, b) => {
      const toInt = (ttype: SkillType | null | undefined) => {
        if (ttype === "Maze") return 4;
        if (ttype === "Ultra") return 3;
        if (ttype === "BPSkill") return 2;
        if (ttype === "Talent") return 1;
        return 0;
      };
      return toInt(a.attack_type) - toInt(b.attack_type);
    });

  return (
    <div className="flex flex-col">
      <div className="flex h-fit flex-col sm:flex-row">
        <div className="grid grid-cols-4">
          {sortedSkills.map((skill, index) => (
            <Toggle
              key={index}
              className={cn("flex h-fit flex-col items-center px-1 py-1.5")}
              pressed={
                skill.attack_type === selectedSkill.attack_type &&
                skill.skill_name === selectedSkill.skill_name
              }
              onPressedChange={() => setSelectedSkill(skill)}
            >
              {getImagePath(characterId, skill) && (
                <Image
                  src={`${getImagePath(characterId, skill)}`}
                  alt={skill.skill_name}
                  className="invert dark:invert-0"
                  width={64}
                  height={64}
                />
              )}
              <span className="self-center">
                {parseSkillType(skill.attack_type, skill.skill_type_desc)}
              </span>
            </Toggle>
          ))}
        </div>

        <Separator className="my-3 sm:hidden" />

        <div className="flex w-full grow flex-col px-4 py-2 sm:w-auto">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            <span>{selectedSkill.skill_name}</span>
            {selectedSkill.attack_type === "Ultra" && ` (${maxEnergy} Energy)`}
          </h3>
          {selectedSkill.param_list.length > 1 && (
            <div className="flex items-center gap-4">
              <span className="whitespace-nowrap">Lv. {selectedSlv + 1}</span>
              <Slider
                className="py-4"
                defaultValue={[0]}
                min={0}
                max={selectedSkill.param_list.length - 1}
                onValueChange={(e) => setSelectedSlv(e[0])}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="mt-2 min-h-[8rem] rounded-md border p-4">
          <SkillDescription
            slv={selectedSlv}
            skillDesc={selectedSkill.skill_desc}
            paramList={selectedSkill.param_list}
          />
        </div>
      </div>
    </div>
  );
};

function getImagePath(
  characterId: number | null | undefined,
  skill: AvatarSkillConfig
): string | undefined {
  let ttype = "";
  if (skill.attack_type) {
    switch (skill.attack_type) {
      case "Normal":
        ttype = "basic_attack";
        break;
      case "BPSkill":
        ttype = "skill";
        break;
      case "Ultra":
        ttype = "ultimate";
        break;
      case "Talent":
        ttype = "talent";
        break;
      case "Maze":
        ttype = "technique";
        break;
    }
  } else {
    switch (skill.skill_type_desc) {
      case "Basic ATK":
        ttype = "basic_attack";
        break;
      case "Skill":
        ttype = "skill";
        break;
      case "Ultra":
        ttype = "ultimate";
        break;
      case "Talent":
        ttype = "talent";
        break;
      case "Technique":
        ttype = "technique";
        break;
    }
  }
  if (!characterId) return undefined;
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${characterId}_${ttype}.png`;
}
export { SkillOverview };
