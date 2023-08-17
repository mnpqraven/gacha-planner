import { ConfigController } from "./ConfigController";
import { CardConfigController } from "./ConfigControllerContext";
import { CharacterCardWrapper } from "./_components/CharacterCard";
import { Exporter } from "./_components/Exporter";
import { LineupSelector } from "./_components/LineupSelector";
import { getMihomoInfo } from "./_fetcher";

interface Props {
  params: { uid: string };
  searchParams: { lang: string };
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { player } = await getMihomoInfo(params.uid, searchParams.lang);
  return {
    title: `${player.nickname}'s Player Card`,
    description: `${player.nickname}'s Player Card`,
  };
}

export default async function ProfileCard({ params, searchParams }: Props) {
  const blob = await getMihomoInfo(params.uid, searchParams.lang);

  return (
    <CardConfigController>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          <LineupSelector />
          <Exporter />
          <ConfigController />
        </div>

        <CharacterCardWrapper data={blob} />
      </main>
    </CardConfigController>
  );
}
