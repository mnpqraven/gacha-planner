"use client";

import Link from "next/link";
import { IMAGE_URL } from "@/server/endpoints";
import { DbFilter } from "../components/Db/DbFilter";
import Fuse from "fuse.js";
import { useState } from "react";
import { LightCone } from "@/bindings/LightConeFull";
import { LightConeCard } from "./LightConeCard";
import useLightConeFilter from "../components/Db/useLightConeFilter";
import { useRouter } from "next/navigation";

type Props = {
  data: LightCone[];
};

const LightConeCatalogue = ({ data }: Props) => {
  const router = useRouter();
  const filter = useLightConeFilter();
  const [searchData, setSearchData] = useState(data);
  const processedData = searchData
    .filter(filter.byRarity)
    .filter(filter.byPath);
  const fz = new Fuse(data, {
    keys: ["metadata.equipment_name", "metadata.equipment_id", "max_sp"],
    threshold: 0.4,
  });

  function updateSearch(query: string) {
    if (query.length > 0) {
      const res = fz.search(query);
      setSearchData(res.map((e) => e.item));
    } else {
      //reset
      setSearchData(data);
    }
  }

  function onEnter(_query: string) {
    if (processedData.length > 0)
      router.push(`/lightcone-db/${processedData[0].id}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <DbFilter
        minRarity={4}
        updateText={updateSearch}
        onEnterKey={onEnter}
        {...filter}
      />
      <div className="grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {processedData.map((lc) => (
          <div
            id="lc-card"
            key={lc.metadata.equipment_id}
            className="flex flex-col items-center gap-3 self-start"
          >
            <Link
              href={`/lightcone-db/${lc.metadata.equipment_id}`}
              className="relative"
            >
              <LightConeCard
                rarity={lc.metadata.rarity}
                path={lc.metadata.avatar_base_type}
                name={lc.metadata.equipment_name}
                imgUrl={url(lc.metadata.equipment_id)}
              />
            </Link>

            <p className="text-center font-semibold">
              {lc.metadata.equipment_name}
            </p>
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
