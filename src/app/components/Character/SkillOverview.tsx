"use client";

import { SimpleSkill, SkillType } from "@/bindings/PatchBanner";
import Image from "next/image";
import { useState } from "react";
import { Slider } from "../ui/Slider";
import { parseSkillType } from "@/lib/utils";
import { Toggle } from "../ui/Toggle";
import { Separator } from "../ui/Separator";
import { SkillDescription } from "./SkillDescription";

type Props = {
  skills: SimpleSkill[];
  characterId: number;
  maxEnergy: number;
};
const SkillOverview = ({ skills, characterId, maxEnergy }: Props) => {
  const [selectedSkill, setSelectedSkill] = useState<SimpleSkill>(
    skills.find((e) => e.ttype === "Talent") ?? skills[0]
  );
  const [selectedSlv, setSelectedSlv] = useState(0);

  const sortedSkills = skills
    .filter((skill) => skill.ttype !== "Normal" && skill.ttype !== "MazeNormal")
    .sort((a, b) => {
      const toInt = (ttype: SimpleSkill["ttype"]) => {
        if (ttype === "Maze") return 4;
        if (ttype === "Ultra") return 3;
        if (ttype === "BPSkill") return 2;
        if (ttype === "Talent") return 1;
        return 0;
      };
      return toInt(a.ttype) - toInt(b.ttype);
    });

  return (
    <div className="flex flex-col">
      <div className="flex h-fit flex-col sm:flex-row">
        <div className="grid grid-cols-4">
          {sortedSkills.map((skill, index) => (
            <Toggle
              key={index}
              className="flex h-fit flex-col items-center px-1 py-1.5"
              pressed={
                skill.ttype === selectedSkill.ttype &&
                skill.name === selectedSkill.name
              }
              onPressedChange={() => setSelectedSkill(skill)}
            >
              {getImagePath(characterId, skill.ttype) && (
                <Image
                  src={`${getImagePath(characterId, skill.ttype)}`}
                  alt={skill.name}
                  // className="min-h-[64px] min-w-[64px]"
                  width={64}
                  height={64}
                />
              )}
              <span className="self-center">{parseSkillType(skill.ttype)}</span>
            </Toggle>
          ))}
        </div>

        <Separator className="my-3 sm:hidden" />

        <div className="flex w-full grow flex-col px-4 py-2 sm:w-auto">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            <span>{selectedSkill.name}</span>
            {selectedSkill.ttype === "Ultra" && ` (${maxEnergy} Energy)`}
          </h3>
          {selectedSkill.params.length > 1 && (
            <div className="flex items-center gap-4">
              <span className="whitespace-nowrap">Lv. {selectedSlv + 1}</span>
              <Slider
                className="py-4"
                defaultValue={[0]}
                min={0}
                max={selectedSkill.params.length - 1}
                onValueChange={(e) => setSelectedSlv(e[0])}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="mt-2 min-h-[8rem] rounded-md border p-4">
          <SkillDescription skill={selectedSkill} slv={selectedSlv} />
        </div>
      </div>
    </div>
  );
};

function getImagePath(
  characterId: number | null | undefined,
  iconType: SkillType
): string | undefined {
  let ttype = "";
  switch (iconType) {
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
  if (!characterId) return undefined;
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${characterId}_${ttype}.png`;
}
export { SkillOverview };
