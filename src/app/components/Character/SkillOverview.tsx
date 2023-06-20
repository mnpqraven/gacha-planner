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
      </div>

      <div className="flex flex-col gap-4">
        <span>
          {selectedSkill.name} - {selectedSkill.ttype} - Slv. {selectedSlv + 1}
        </span>
        {selectedSkill.params.length > 1 && (
          <Slider
            defaultValue={[0]}
            min={0}
            max={selectedSkill.params.length - 1}
            onValueChange={(e) => setSelectedSlv(e[0])}
          />
        )}
        <p>{skillDescription}</p>
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
