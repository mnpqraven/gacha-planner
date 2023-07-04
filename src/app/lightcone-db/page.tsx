import { IMAGE_URL } from "@/server/endpoints";
import API from "@/server/typedEndpoints";
import Link from "next/link";
import { LightConeCard } from "./LightConeCard";

export default async function LightConeDb() {
  let { list } = await API.lightConeList.fetch();
  let sortedDb = list.sort((a, b) => {
    return (
      b.metadata.rarity - a.metadata.rarity ||
      a.metadata.equipment_name.localeCompare(b.metadata!.equipment_name)
    );
  });

  return (
    <main className="container grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 pt-4 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {sortedDb.map((lc) => (
        <div
          id="lc-card"
          key={lc.metadata.equipment_id}
          className="flex flex-col items-center justify-center gap-3"
        >
          <Link
            href={`/lightcone-db/${lc.metadata.equipment_id}`}
            className="relative flex flex-col items-center"
          >
            <LightConeCard
              rarity={lc.metadata.rarity}
              path={lc.metadata.avatar_base_type}
              name={lc.metadata.equipment_name}
              imgUrl={url(lc.metadata.equipment_id)}
            />
          </Link>

          <p className="font-semibold">{lc.metadata.equipment_name}</p>
        </div>
      ))}
    </main>
  );
}

function url(id: string | number): string {
  return IMAGE_URL + `image/light_cone_preview/${id}.png`;
}
