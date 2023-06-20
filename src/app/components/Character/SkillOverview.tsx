import { SimpleSkill, SkillType } from "@/bindings/PatchBanner";
import Image from "next/image";
import { useState } from "react";
import { Slider } from "../ui/Slider";

type Props = {
  skills: SimpleSkill[];
  characterId: number;
};
const SkillOverview = ({ skills, characterId }: Props) => {
  const [selectedSkill, setSelectedSkill] = useState<SimpleSkill>(skills[0]);
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
            <div className="flex flex-col" key={index}>
              {getImagePath(characterId, skill.ttype) && (
                <Image
                  src={`${getImagePath(characterId, skill.ttype)}`}
                  alt={skill.name}
                  width={64}
                  height={64}
                  onClick={() => setSelectedSkill(skills[index])}
                />
              )}
              <span className="self-center">{skill.ttype}</span>
            </div>
          ))}
        <div className="flex flex-col px-4">
          <div>
            {selectedSkill.name} - {selectedSkill.ttype} - Slv.{" "}
            {selectedSlv + 1}
          </div>
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
