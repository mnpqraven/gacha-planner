import API from "@/server/typedEndpoints";
import CharacterCatalogue from "./CharacterCatalogue";

export const metadata = {
  title: "Character Database",
  description: "Honkai Star Rail Character Database",
};

export default async function CharacterDb() {
  let { list } = await API.characterByIds.get();
  let sortedDb = list.sort((a, b) => {
    return (
      b.rarity - a.rarity ||
      a.avatar_name.localeCompare(b.avatar_name) ||
      a.avatar_votag.localeCompare(b.avatar_votag)
    );
  });

  return (
    <main className="px-2 py-4 md:container md:px-0">
      <CharacterCatalogue data={sortedDb} />
    </main>
  );
}
