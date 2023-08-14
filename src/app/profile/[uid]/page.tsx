import { CharacterCardWrapper } from "./_components/CharacterCard";
import { getMihomoInfo } from "./_fetcher";

interface Props {
  params: { uid: string };
}

export async function generateMetadata({ params }: Props) {
  const { uid } = params;
  const blob = await getMihomoInfo(uid);
  return {
    title: `${blob.player.nickname}'s Player Card`,
    description: `${blob.player.nickname}'s Player Card`,
  };
}

export default async function ProfileCard({ params }: Props) {
  const blob = await getMihomoInfo(params.uid);

  return <CharacterCardWrapper data={blob} />;
}
