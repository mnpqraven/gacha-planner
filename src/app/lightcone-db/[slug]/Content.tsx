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
  ranking?: boolean;
};
function Content({ data: lc, ranking = false }: Props) {
  const [promotion, setPromotion] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex-1">
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>{lc.metadata.equipment_name}</CardTitle>
            <CardDescription>{lc.skill.skill_name}</CardDescription>
          </CardHeader>

          {/* <div className="mr-6 flex w-48 flex-col"> */}

          <CardHeader>
            <CardTitle className="w-32">Superimpose {promotion + 1}</CardTitle>
            <CardDescription>
              <Slider
                className="my-1.5"
                min={0}
                max={4}
                onValueChange={(e) => setPromotion(e[0])}
              />
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          <SkillDescription
            description={lc.skill.skill_desc}
            params={lc.skill.param_list}
            slv={promotion}
          />
        </CardContent>
      </Card>

      {ranking && (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Stat Ranking</CardTitle>
          </CardHeader>
          <CardContent>Coming soon!</CardContent>
        </Card>
      )}
    </div>
  );
}
export { Content };
