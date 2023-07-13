"use client";

import { DbCharacterEidolon } from "@/bindings/DbCharacterEidolon";
import ENDPOINT from "@/server/endpoints";
import { typedFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Toggle } from "../ui/Toggle";
import { cn, sanitizeNewline } from "@/lib/utils";
import { Badge } from "../ui/Badge";
import { useTheme } from "next-themes";

type Props = {
  characterId: number;
};

const EidolonTable = ({ characterId }: Props) => {
  const [selectedEidolon, setSelectedEidolon] = useState(1);
  const { data } = useQuery({
    queryKey: ["eidolon", characterId],
    queryFn: async () =>
      await typedFetch<undefined, { list: DbCharacterEidolon[] }>(
        ENDPOINT.mhyEidolon,
        undefined,
        characterId
      ),
  });
  if (!data) return null;

  const bottom = data.list.sort((a, b) => a.rank - b.rank).slice(3);
  const top = data.list.sort((a, b) => a.rank - b.rank).slice(0, 3);

  return (
    <>
      {top && (
        <EidolonRow
          data={top}
          selectedEidolon={selectedEidolon}
          setSelectedEidolon={setSelectedEidolon}
          characterId={characterId}
        />
      )}

      <div className="my-2 min-h-[8rem] whitespace-pre-wrap rounded-md border p-4">
        {sanitizeNewline(
          data?.list.find((e) => e.rank == selectedEidolon)?.desc
        )}
      </div>

      {bottom && (
        <EidolonRow
          data={bottom.reverse()}
          selectedEidolon={selectedEidolon}
          setSelectedEidolon={setSelectedEidolon}
          characterId={characterId}
        />
      )}
    </>
  );
};

type EidolonRowProps = {
  data: DbCharacterEidolon[];
  selectedEidolon: number;
  setSelectedEidolon: (value: number) => void;
  characterId: number;
};
const EidolonRow = ({
  data,
  selectedEidolon,
  setSelectedEidolon,
  characterId,
}: EidolonRowProps) => {
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map((eidolon) => (
        <Toggle
          key={eidolon.id}
          className="flex h-full flex-1 flex-col justify-start gap-2 py-2 sm:flex-row"
          pressed={selectedEidolon === eidolon.rank}
          onPressedChange={() => setSelectedEidolon(eidolon.rank)}
        >
          <div className="flex flex-col items-center gap-1">
            <Image
              src={url(characterId, eidolon.rank)}
              alt={eidolon.name}
              onClick={() => setSelectedEidolon(eidolon.rank)}
              width={64}
              height={64}
              className="aspect-square min-w-[64px] invert dark:invert-0"
            />
            <Badge className="w-fit sm:inline">E{eidolon.rank}</Badge>
          </div>

          <span className="md:text-lg">{eidolon.name}</span>
        </Toggle>
      ))}
    </div>
  );
};

function url(charID: number, eidolon: number) {
  let fmt = `rank${eidolon}`;
  if (eidolon == 3) fmt = "skill";
  if (eidolon == 5) fmt = "ultimate";
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${charID}_${fmt}.png`;
}
export { EidolonTable };
