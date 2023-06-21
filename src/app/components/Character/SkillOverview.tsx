import { SimpleSkill, SkillType } from "@/bindings/PatchBanner";
import Image from "next/image";
import { useState } from "react";
import { Slider } from "../ui/Slider";
import { parseSkillType } from "@/lib/utils";
import { Toggle } from "../ui/Toggle";

type Props = {
  skills: SimpleSkill[];
  characterId: number;
};
const SkillOverview = ({ skills, characterId }: Props) => {
  const [selectedSkill, setSelectedSkill] = useState<SimpleSkill>(
    skills.find((e) => e.ttype === "BPSkill") ?? skills[0]
  );
  const [selectedSlv, setSelectedSlv] = useState(0);

  const skillDescription = selectedSkill.description.reduce((a, b, index) => {
    if (index === 0) return a + b; // index 0 is before a
    else {
      if (!selectedSkill.params[selectedSlv])
        return a + selectedSkill.params[0][index - 1] + b;
      return a + selectedSkill.params[selectedSlv][index - 1] + b;
    }
  }, "");
  return (
    <>
      <div className="flex h-fit">
        {skills
          .filter(
            (skill) => skill.ttype !== "Normal" && skill.ttype !== "MazeNormal"
          )
          .sort((a, b) => {
            const toInt = (ttype: SimpleSkill["ttype"]) => {
              if (ttype === "Ultra") return 4;
              if (ttype === "BPSkill") return 3;
              if (ttype === "Talent") return 2;
              if (ttype === "Maze") return 1;
              return 0;
            };
            return toInt(a.ttype) - toInt(b.ttype);
          })
          .map((skill, index) => (
            <Toggle
              key={index}
              className="h-fit"
              pressed={skill.ttype === selectedSkill.ttype}
              onPressedChange={() => setSelectedSkill(skill)}
            >
              <div className="flex flex-col">
                {getImagePath(characterId, skill.ttype) && (
                  <Image
                    src={`${getImagePath(characterId, skill.ttype)}`}
                    alt={skill.name}
                    className="min-h-[64px] min-w-[64px]"
                    width={64}
                    height={64}
                  />
                )}
                <span className="self-center">
                  {parseSkillType(skill.ttype)}
                </span>
              </div>
            </Toggle>
          ))}
        <div className="flex flex-col px-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            <span>
              {selectedSkill.name} - {parseSkillType(selectedSkill.ttype)}
            </span>
            {selectedSkill.ttype !== "Maze" && <span>{selectedSlv + 1}</span>}
          </h3>
          {selectedSkill.params.length > 1 && (
            <Slider
              className="py-4"
              defaultValue={[0]}
              min={0}
              max={selectedSkill.params.length - 1}
              onValueChange={(e) => setSelectedSlv(e[0])}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="border rounded-md p-4 my-4 min-h-[8rem]">
          {skillDescription}
        </div>
      </div>
    </>
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
