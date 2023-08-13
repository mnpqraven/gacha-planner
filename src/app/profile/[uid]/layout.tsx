import { ReactNode } from "react";
import { CardConfigController } from "./ConfigController";
import { CharacterCardWrapper } from "./_components/CharacterCard";
import { LineupSelector } from "./_components/LineupSelector";
import { getMihomoInfo } from "./_fetcher";

interface Props {
  params: { uid: string };
  children: ReactNode;
}

export async function generateMetadata({ params }: Props) {
  const { uid } = params;
  const blob = await getMihomoInfo(uid);
  return {
    title: `${blob.player.nickname}'s Player Card`,
    description: `${blob.player.nickname}'s Player Card`,
  };
}

export default async function Layout({ params, children }: Props) {
  const { uid } = params;
  const mhyData = await getMihomoInfo(uid);

  return (
    <main className="flex-col items-center justify-center">
      <CardConfigController>
        <LineupSelector characters={mhyData.characters} />
        {children}
      </CardConfigController>
    </main>
  );
}
