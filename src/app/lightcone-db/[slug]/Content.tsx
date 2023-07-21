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
import { EquipmentConfig } from "@/bindings/EquipmentConfig";
import { EquipmentSkillConfig } from "@/bindings/EquipmentSkillConfig";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  data: EquipmentConfig;
  skill: EquipmentSkillConfig;
  link?: boolean;
};
function Content({ data, skill, link = false }: Props) {
  const [promotion, setPromotion] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex-1">
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>
              {link ? (
                <Link
                  href={`/lightcone-db/${data.equipment_id}`}
                  className="hover:underline flex items-center"
                >
                  {data.equipment_name}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <span>{data.equipment_name}</span>
              )}
            </CardTitle>
            <CardDescription>{skill.skill_name}</CardDescription>
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
            skillDesc={skill.skill_desc}
            paramList={skill.param_list}
            slv={promotion}
          />
        </CardContent>
      </Card>
    </div>
  );
}
export { Content };
