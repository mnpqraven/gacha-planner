"use client";

import { LightConeCard } from "@/app/lightcone-db/LightConeCard";
import { Content } from "@/app/lightcone-db/[slug]/Content";
import { Portrait } from "@/app/lightcone-db/[slug]/Portrait";
import { EquipmentConfig } from "@/bindings/EquipmentConfig";
import { EquipmentSkillConfig } from "@/bindings/EquipmentSkillConfig";
import { IMAGE_URL } from "@/server/endpoints";
import API from "@/server/typedEndpoints";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Props {
  characterId: number;
}

const SignatureLightCone = ({ characterId }: Props) => {
  const { data: atlas } = useQuery({
    queryKey: ["signature_atlas"],
    queryFn: async () => await API.signatureAtlas.get(),
    suspense: true
  });

  const lc_ids = atlas?.list.find((e) => e.char_id === characterId)?.lc_id;

  // const { data: lcMetadata } = useQuery({
  //   queryKey: ["lightconeMetadata", lc_ids],
  //   queryFn: async () =>
  //     await API.lightConeMetadataMany.post({ payload: { list: lc_ids ?? [] } }),
  //   enabled: !!lc_ids,
  // });
  // const { data: lcSkill } = useQuery({
  //   queryKey: ["lightconeSkill", lc_ids],
  //   queryFn: async () =>
  //     await API.lightConeSkillMany.post({ payload: { list: lc_ids ?? [] } }),
  //   enabled: !!lc_ids,
  // });
  const [metadataQuery, skillQuery] = useQueries({
    queries: [
      {
        queryKey: ["lightconeMetadata", lc_ids],
        queryFn: async () =>
          await API.lightConeMetadataMany.post({
            payload: { list: lc_ids ?? [] },
          }),
        enabled: !!lc_ids,
      },
      {
        queryKey: ["lightconeSkill", lc_ids],
        queryFn: async () =>
          await API.lightConeSkillMany.post({
            payload: { list: lc_ids ?? [] },
          }),
        enabled: !!lc_ids,
      },
    ],
  });
  const { data: lcMetadata } = metadataQuery;
  const { data: lcSkill } = skillQuery;

  const [selectedLc, setSelectedLc] = useState<
    { metadata: EquipmentConfig; skill: EquipmentSkillConfig } | undefined
  >(undefined);

  useEffect(() => {
    if (lcMetadata?.list && lcSkill?.list) {
      let id = lcMetadata.list[0].skill_id;
      let correspondingSkill = lcSkill.list.find((e) => e.skill_id == id)!;
      setSelectedLc({
        metadata: lcMetadata.list[0],
        skill: correspondingSkill,
      });
    }
  }, [lcMetadata, lcSkill]);

  function updateSelectedLc(metadata: EquipmentConfig) {
    if (lcSkill) {
      let skill = lcSkill.list.find((e) => e.skill_id == metadata.skill_id);
      if (skill) setSelectedLc({ metadata, skill });
    }
  }

  if (!lcMetadata) return null;

  const sortedLcs = lcMetadata.list.sort((a, b) => b.rarity - a.rarity);

  return (
    <div className="block">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <div className="col-span-1 flex flex-col">
          {selectedLc && (
            <div className="p-6">
              <Portrait data={selectedLc.metadata} />
            </div>
          )}
        </div>

        {selectedLc && (
          <div className="col-span-2 flex flex-col">
            <div className="grid grid-cols-4">
              {sortedLcs.map((lc, index) => (
                <div
                  key={index}
                  onClick={() => updateSelectedLc(lc)}
                  className="relative p-2"
                >
                  <LightConeCard
                    name={lc.equipment_name}
                    imgUrl={url(lc.equipment_id)}
                  />
                </div>
              ))}
            </div>

            <Content data={selectedLc.metadata} skill={selectedLc.skill} link />
          </div>
        )}
      </div>
    </div>
  );
};

export { SignatureLightCone };

function url(id: string | number): string {
  return IMAGE_URL + `image/light_cone_preview/${id}.png`;
}
