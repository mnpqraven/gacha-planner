import API from "@/server/typedEndpoints";
import CharacterCatalogue from "./CharacterCatalogue";

export const metadata = {
  title: "Character Database",
  description: "Honkai Star Rail Character Database",
};

export default async function CharacterDb() {
  let { list } = await API.mhyCharacterList.get();
  let sortedDb = list.sort((a, b) => {
    return (
      b.rarity - a.rarity ||
      a.name.localeCompare(b.name) ||
      a.tag.localeCompare(b.tag)
    );
  });

  return (
    <main className="container py-4">
      <CharacterCatalogue data={sortedDb} />
    </main>
  );
}
