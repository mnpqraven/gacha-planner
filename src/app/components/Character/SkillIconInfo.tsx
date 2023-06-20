import { SimpleSkill, SkillType } from "@/bindings/PatchBanner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Slider } from "../ui/Slider";
import Image from "next/image";

type Props = {
  skill: SimpleSkill;
  characterId?: number | null;
};

const SkillIconInfo = ({ skill, characterId }: Props) => {
  const [selectedSlv, setSelectedSlv] = useState(0);

  const skillDescription = skill.description.reduce((a, b, index) => {
    if (index === 0) return a + b; // index 0 is before a
    else return a + skill.params[selectedSlv][index - 1] + b;
  }, "");

  const imageSrc = getImagePath(characterId, skill.ttype);

  return (
    <Popover>
      <PopoverTrigger>
        <Image src={imageSrc} alt={skill.name} width={64} height={64} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex">
          <span>
            {skill.name} - {skill.ttype} - Slv. {selectedSlv + 1}
          </span>
          {skill.params.length > 1 && (
            <Slider
              defaultValue={[0]}
              min={0}
              max={skill.params.length - 1}
              onValueChange={(e) => setSelectedSlv(e[0])}
            />
          )}
        </div>
        <p>{skillDescription}</p>
      </PopoverContent>
    </Popover>
  );
};
export { SkillIconInfo };

function getImagePath(
  characterId: number | null | undefined,
  iconType: SkillType
) {
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
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${
    characterId ?? ""
  }_${ttype}.png`;
}
