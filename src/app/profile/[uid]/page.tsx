import { ConfigController } from "./ConfigControllerDialog";
import { CardConfigProvider } from "./ConfigControllerContext";
import { CharacterCardWrapper } from "./_components/CharacterCard";
import { Exporter } from "./_components/Exporter";
import { LineupSelector } from "./_components/LineupSelector";
import { Share } from "./_components/Share";

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
