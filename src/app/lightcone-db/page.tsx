import API from "@/server/typedEndpoints";
import LightConeCatalogue from "./LightConeCatalogue";

export const metadata = {
  title: "Light Cone Database",
  description: "Honkai Star Rail Light Cone Database",
};

export default async function LightConeDb() {
  let { list } = await API.lightConeMetadataMany.get();
  let sortedDb = list.sort((a, b) => {
    return (
      b.rarity - a.rarity || a.equipment_name.localeCompare(b.equipment_name)
    );
  });

  return (
    <main className="px-2 py-4 md:container md:px-0">
      <LightConeCatalogue data={sortedDb} />
    </main>
  );
}
