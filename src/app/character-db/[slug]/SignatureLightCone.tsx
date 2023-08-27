"use client";

import { LightConeCard } from "@/app/lightcone-db/LightConeCard";
import { Content } from "@/app/lightcone-db/[slug]/Content";
import { Portrait } from "@/app/lightcone-db/[slug]/Portrait";
import { useSuspendedLightConeMetadataMany } from "@/hooks/queries/useLightConeMetadataMany";
import { useSuspendedLightConeSkillMany } from "@/hooks/queries/useLightConeSkillMany";
import { useSuspendedSignatureAtlas } from "@/hooks/queries/useSignatureAtlas";
import { IMAGE_URL } from "@/lib/constants";
import { isEmpty } from "@/lib/utils";
import { useState } from "react";

interface Props {
  characterId: number;
}

const SignatureLightCone = ({ characterId }: Props) => {
  const { data } = useSuspendedSignatureAtlas();
  const lc_ids = data.find((e) => e.charId === characterId)?.lcId ?? [];
  const { data: lcMetadatas } = useSuspendedLightConeMetadataMany(lc_ids);
  const { data: lcSkills } = useSuspendedLightConeSkillMany(lc_ids);

  const [selectedLcId, setSelectedLcId] = useState(lc_ids.at(0));

  const metadata = lcMetadatas.find((e) => e.equipment_id == selectedLcId);
  const skill = lcSkills.find((e) => e.skill_id == metadata?.skill_id);

  if (isEmpty(lcMetadatas) || !metadata || !skill) return null;

  const sortedLcs = lcMetadatas.sort((a, b) => b.rarity - a.rarity);

  return (
    <div className="block">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <div className="col-span-1 flex flex-col p-6">
          <Portrait data={metadata} />
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="grid grid-cols-4">
            {sortedLcs.map((lc, index) => (
              <div
                key={index}
                onClick={() => setSelectedLcId(lc.equipment_id)}
                className="relative p-2"
              >
                <LightConeCard
                  name={lc.equipment_name}
                  imgUrl={url(lc.equipment_id)}
                />
              </div>
            ))}
          </div>

          <Content data={metadata} skill={skill} link />
        </div>
      </div>
    </div>
  );
};

export { SignatureLightCone };

function url(id: string | number): string {
  return IMAGE_URL + `image/light_cone_preview/${id}.png`;
}
