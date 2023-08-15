import { ReactNode } from "react";
import { LineupSelector } from "./_components/LineupSelector";
import { Exporter } from "./_components/Exporter";
import { CardConfigController } from "./ConfigControllerContext";
import { ConfigController } from "./ConfigController";

interface Props {
  params: { uid: string };
  children: ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <CardConfigController>
      <main className="flex flex-col items-center justify-center">
        <div className="mt-2 flex items-center justify-center gap-2">
          <LineupSelector />
          <Exporter />
          <ConfigController />
        </div>
        {children}
      </main>
    </CardConfigController>
  );
}
