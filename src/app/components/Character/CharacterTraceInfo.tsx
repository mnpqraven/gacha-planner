import { SimpleSkill } from "@/bindings/PatchBanner";
import { SkillIconInfo } from "./SkillIconInfo";
import { useState } from "react";
import { Slider } from "../ui/Slider";

type Props = {
  skills: SimpleSkill[];
  characterId: number;
  path?: string;
};
const CharacterTraceInfo = ({
  skills,
  characterId,
  path = "Nihility",
}: Props) => {
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
      <div className="absolute w-full h-full text-center before:inline-block before:align-middle before:h-full -z-50">
        <img
          src={pathUrl(path)}
          alt={path}
          className="inline-block align-middle opacity-10"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex h-fit">
          {skills
            .filter(
              (skill) =>
                skill.ttype !== "Normal" && skill.ttype !== "MazeNormal"
            )
            .map((skill, index) => (
              <div
                className="flex flex-col"
                onClick={() => setSelectedSkill(skills[index])}
              >
                {/* TODO: move that onClick */}
                <SkillIconInfo
                  key={skill.name}
                  skill={skill}
                  characterId={characterId}
                />
                <span className="self-center">{skill.ttype}</span>
              </div>
            ))}
        </div>

        <div className="flex flex-col gap-4">
          <span>
            {selectedSkill.name} - {selectedSkill.ttype} - Slv.{" "}
            {selectedSlv + 1}
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
      </div>
    </>
  );
};
function pathUrl(path: string) {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${path}.png`;
}
export { CharacterTraceInfo };
