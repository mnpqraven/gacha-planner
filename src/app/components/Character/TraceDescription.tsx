import { AvatarSkillConfig } from "@/bindings/AvatarSkillConfig";
import { SkillTreeConfig } from "@/bindings/SkillTreeConfig";
import { asPercentage } from "@/lib/utils";
import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "../ui/Slider";
import { useState } from "react";
import { SkillDescription } from "../Db/SkillDescription";

type Props = {
  traceType: "CORE" | "SMALL" | "BIG";
  trace: SkillTreeConfig;
  maxEnergy: number;
  skill: AvatarSkillConfig | undefined;
};
const TraceDescription = ({ trace, traceType, maxEnergy, skill }: Props) => {
  if (traceType === "SMALL")
    return (
      <span>
        {trace.point_name}: {asPercentage(trace.status_add_list[0].value.value)}
      </span>
    );

  if (traceType === "BIG")
    return (
      <div className="flex flex-col">
        <div>{trace.point_name}</div>
        <SkillDescription
          skillDesc={trace.point_desc}
          paramList={trace.param_list}
          slv={0}
        />
      </div>
    );

  if (skill)
    return (
      <div className="flex flex-col">
        <SkillDescriptionWrapper skill={skill} maxEnergy={maxEnergy} />
      </div>
    );

  return null;
};

const SkillDescriptionWrapper = ({
  skill,
  maxEnergy,
}: {
  skill: AvatarSkillConfig;
  maxEnergy: number;
}) => {
  const [selectedSlv, setSelectedSlv] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold leading-none tracking-tight">
        {skill.skill_name} - {skill.skill_type_desc}
        {skill.attack_type === "Ultra" && ` (${maxEnergy} Energy)`}
      </h3>
      {skill.param_list.length > 1 && (
        <div className="flex items-center">
          <span className="w-24 font-semibold">Level: {selectedSlv + 1}</span>
          <Slider
            className="py-4"
            defaultValue={[0]}
            min={0}
            max={skill.param_list.length - 1}
            onValueChange={(sl) => setSelectedSlv(sl[0])}
          />
        </div>
      )}
      <SkillDescription
        skillDesc={skill.skill_desc}
        paramList={skill.param_list}
        slv={selectedSlv}
      />
    </div>
  );
};

export { TraceDescription };
