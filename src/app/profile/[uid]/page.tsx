import { CharacterCardWrapper } from "./_components/CharacterCard";
import { getMihomoInfo } from "./_fetcher";

interface Props {
  params: { uid: string };
  searchParams: { lang: string };
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { uid } = params;
  const { lang } = searchParams;
  const { player } = await getMihomoInfo(uid, lang);
  return {
    title: `${player.nickname}'s Player Card`,
    description: `${player.nickname}'s Player Card`,
  };
}

export default async function ProfileCard({ params, searchParams }: Props) {
  const { uid } = params;
  const { lang } = searchParams;
  const blob = await getMihomoInfo(uid, lang);
  console.log("uid and lang", uid, lang);

  return <CharacterCardWrapper data={blob} />;
}
