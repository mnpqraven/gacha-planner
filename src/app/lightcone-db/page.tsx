import API from "@/server/typedEndpoints";
import LightConeCatalogue from "./LightConeCatalogue";

export const metadata = {
  title: "Light Cone Database",
  description: "Honkai Star Rail Light Cone Database",
};

export default async function LightConeDb() {
  let { list } = await API.lightConeList.get();
  let sortedDb = list.sort((a, b) => {
    return (
      b.metadata.rarity - a.metadata.rarity ||
      a.metadata.equipment_name.localeCompare(b.metadata!.equipment_name)
    );
  });

  return (
    <main className="container py-4">
      <LightConeCatalogue data={sortedDb} />
    </main>
  );
}
