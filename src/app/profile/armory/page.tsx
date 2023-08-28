import { LANGS } from "@/lib/constants";
import { CharacterSelector } from "./_components/CharacterSelector";
import { CardConfigProvider } from "../[uid]/ConfigControllerContext";
import { Exporter } from "../[uid]/_components/Exporter";
import { ConfigController } from "../[uid]/ConfigControllerDialog";
import { CharacterCardWrapper } from "../[uid]/_components/CharacterCard";
import { ArmoryEditor } from "./_components/Editor";

interface Props {
  params: { uid: string };
  searchParams: { lang: (typeof LANGS)[number] | undefined };
}
export default async function ProfileCard({
  params: { uid },
  searchParams: { lang },
}: Props) {
  return (
    <CardConfigProvider>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          <CharacterSelector />
          <Exporter />
          <ConfigController />
        </div>

        <ArmoryEditor />

        <CharacterCardWrapper uid={uid} lang={lang} mode="ARMORY" />
      </main>
    </CardConfigProvider>
  );
}
