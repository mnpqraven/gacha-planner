import { ConfigController } from "./ConfigControllerDialog";
import { CharacterCardWrapper } from "./_components/CharacterCard";
import { Exporter } from "./_components/Exporter";
import { LineupSelector } from "./_components/LineupSelector";
import { Share } from "./_components/Share";
import { LANGS } from "@/lib/constants";
import { StateProvider } from "../armory-jotai/StateProvider";
import { DisplayCard } from "../armory-jotai/_viewer/DisplayCard";

interface Props {
  params: { uid: string };
  searchParams: { lang: (typeof LANGS)[number] | undefined };
}
export default async function ProfileCard({
  params: { uid },
  searchParams: { lang },
}: Props) {
  return (
    <StateProvider>
      {/* <CardConfigProvider></CardConfigProvider> */}
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          {/* <LineupSelector /> */}
          {/* <Exporter /> */}
          {/* <Share /> */}
          {/* <ConfigController /> */}
        </div>

        <DisplayCard uid={uid} lang={lang} mode="API" />
      </main>
    </StateProvider>
  );
}
