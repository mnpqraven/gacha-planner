import { ReactNode } from "react";
import { LineupSelector } from "./_components/LineupSelector";
import { getMihomoInfo } from "./_fetcher";
import { Exporter } from "./_components/Exporter";
import { CardConfigController } from "./ConfigControllerContext";
import { ConfigController } from "./ConfigController";

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
    <CardConfigController>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          <LineupSelector characters={mhyData.characters} />
          <Exporter />
          <ConfigController />
        </div>
        {children}
      </main>
    </CardConfigController>
  );
}
