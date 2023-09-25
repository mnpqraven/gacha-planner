"use client";

import Link from "next/link";
import { DbFilter } from "../components/Db/DbFilter";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import { LightConeCard } from "./LightConeCard";
import useLightConeFilter from "../components/Db/useLightConeFilter";
import { useRouter } from "next/navigation";
import { IMAGE_URL } from "@/lib/constants";
import { useLightConeList } from "@/hooks/queries/useLightConeList";
import { EquipmentConfig } from "@/bindings/EquipmentConfig";

const keys = ["metadata.equipment_name", "metadata.equipment_id", "max_sp"];

function search(data: EquipmentConfig[], query: string | undefined) {
  const fz = new Fuse(data, {
    keys,
    threshold: 0.4,
  });

  if (query?.length) return fz.search(query).map((e) => e.item);
  else return data;
}
const LightConeCatalogue = () => {
  const router = useRouter();
  const { filter, query, updateQuery } = useLightConeFilter();
  const { data } = useLightConeList();
  const processedData = search(data, query)
    .filter(filter.byRarity)
    .filter(filter.byPath);

  function onEnter(_query: string) {
    if (processedData.length > 0)
      router.push(`/lightcone-db/${processedData[0].equipment_id}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <DbFilter
        minRarity={4}
        updateText={updateQuery}
        onEnterKey={onEnter}
        {...filter}
      />
      <div className="grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {processedData.map((lc) => (
          <div
            id="lc-card"
            key={lc.equipment_id}
            className="flex flex-col items-center gap-3 self-start"
          >
            <Link href={`/lightcone-db/${lc.equipment_id}`}>
              <LightConeCard
                rarity={lc.rarity}
                path={lc.avatar_base_type}
                name={lc.equipment_name}
                imgUrl={url(lc.equipment_id)}
              />
            </Link>

            <p className="text-center font-semibold">{lc.equipment_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LightConeCatalogue;

function url(id: string | number): string {
  return IMAGE_URL + `image/light_cone_preview/${id}.png`;
}
