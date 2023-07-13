"use client";

import { LightConeCard } from "@/app/lightcone-db/LightConeCard";
import { Content } from "@/app/lightcone-db/[slug]/Content";
import { Portrait } from "@/app/lightcone-db/[slug]/Portrait";
import { LightCone } from "@/bindings/LightConeFull";
import { IMAGE_URL } from "@/server/endpoints";
import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Props {
  characterId: number;
}

const SignatureLightCone = ({ characterId }: Props) => {
  const { data: atlas } = useQuery({
    queryKey: ["signature_atlas"],
    queryFn: async () => await API.signatureAtlas.get(),
  });

  const lc_ids = atlas?.list.find((e) => e.char_id === characterId)?.lc_id;

  const { data: lcs } = useQuery({
    queryKey: ["lightcones", lc_ids],
    queryFn: async () =>
      await API.lightCone.post({ payload: { list: lc_ids ?? [] } }),
    enabled: !!lc_ids,
    initialData: { list: [] },
  });

  const [selectedLc, setSelectedLc] = useState<LightCone | undefined>(
    undefined
  );

  useEffect(() => {
    if (lcs.list) {
      setSelectedLc(lcs.list[0]);
    }
  }, [lcs.list]);

  if (!lcs) return null;

  const sortedLcs = lcs.list.sort(
    (a, b) => b.metadata.rarity - a.metadata.rarity
  );

  return (
    <div className="block">
      <div
        id="flexcontainer"
        className="flex flex-col gap-4 sm:grid sm:grid-cols-3"
      >
        <div className="col-span-1 flex flex-col">
          {selectedLc && (
            <div className="p-6">
              <Portrait data={selectedLc} />
            </div>
          )}
        </div>

        {selectedLc && (
          <div className="col-span-2 flex flex-col">
            <div className="grid grid-cols-4">
              {sortedLcs.map((lc, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedLc(lc)}
                  className="relative p-2"
                >
                  <LightConeCard
                    name={lc.metadata.equipment_name}
                    imgUrl={url(lc.metadata.equipment_id)}
                  />
                </div>
              ))}
            </div>

            <Content data={selectedLc} />
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
