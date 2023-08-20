import { getMihomoInfo } from "@/app/api/profile/[uid]/route";
import { ConfigController } from "./ConfigControllerDialog";
import { CardConfigProvider } from "./ConfigControllerContext";
import { CharacterCardWrapper } from "./_components/CharacterCard";
import { Exporter } from "./_components/Exporter";
import { LineupSelector } from "./_components/LineupSelector";
import { env } from "@/envSchema.mjs";
import { Share } from "./_components/Share";

interface Props {
  params: { uid: string };
  searchParams: { lang: string };
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { player } = await getMihomoInfo(
    params.uid,
    searchParams.lang,
    env.NEXT_PUBLIC_BASE_URL
  );
  return {
    title: `${player.nickname}'s Player Card`,
    description: `${player.nickname}'s Player Card`,
  };
}

export default async function ProfileCard() {
  return (
    <CardConfigProvider>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          <LineupSelector />
          <Exporter />
          <Share />
          <ConfigController />
        </div>

        <CharacterCardWrapper />
      </main>
    </CardConfigProvider>
  );
}
