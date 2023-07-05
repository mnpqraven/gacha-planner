"use client";

import { SkillDescription } from "@/app/components/Db/SkillDescription";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Slider } from "@/app/components/ui/Slider";
import { LightCone } from "@/bindings/LightConeFull";
import { useState } from "react";

type Props = {
  data: LightCone;
};
function Content({ data: lc }: Props) {
  const [promotion, setPromotion] = useState(0);

  return (
    <Card>
      <div className="flex items-center">
        <CardHeader>
          <CardTitle>{lc.metadata.equipment_name}</CardTitle>
          <CardDescription>{lc.skill.skill_name}</CardDescription>
        </CardHeader>
        <div className="w-48 mr-6">
          <Slider min={0} max={4}
          className="w-full"
          onValueChange={(e) => setPromotion(e[0])} />
        </div>
      </div>
      <CardContent>
        <SkillDescription
          description={lc.skill.skill_desc}
          params={lc.skill.param_list}
          slv={promotion}
        />
      </CardContent>
    </Card>
  );
}
export { Content };
