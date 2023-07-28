"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Fragment, Suspense, useState } from "react";
import { Toggle } from "../ui/Toggle";
import { sanitizeNewline } from "@/lib/utils";
import { Badge } from "../ui/Badge";
import API from "@/server/typedEndpoints";
import { AvatarRankConfig } from "@/bindings/AvatarRankConfig";
import { Skeleton } from "../ui/Skeleton";

type Props = {
  characterId: number;
};

const EidolonTable = ({ characterId }: Props) => {
  const [selectedEidolon, setSelectedEidolon] = useState(1);
  const { data } = useQuery({
    queryKey: ["eidolon", characterId],
    queryFn: async () => await API.eidolon.get(characterId),
    suspense: true,
  });

  const top = data?.list
    .filter((e) => e.rank <= 3)
    .sort((a, b) => a.rank - b.rank);
  const bottom = data?.list
    .filter((e) => e.rank > 3)
    .sort((a, b) => a.rank - b.rank);

  const currentEidolon = data?.list.find((e) => e.rank === selectedEidolon);

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
        {currentEidolon?.desc.map((descPart, index) => (
          <Fragment key={index}>
            <span className="whitespace-pre-wrap">
              {sanitizeNewline(descPart)}
            </span>
            <span className="font-semibold text-accent-foreground">
              {currentEidolon.param[index]}
            </span>
          </Fragment>
        ))}
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
  data: AvatarRankConfig[];
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
  return (
    <div className="grid grid-cols-3 gap-2">
      {data
        ? data.map((eidolon) => (
            <Toggle
              key={eidolon.rank_id}
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
          ))
        : [0, 1, 2].map((key) => (
            <Toggle
              key={key}
              className="h-full flex-1 gap-2 py-2 sm:flex-row"
            ></Toggle>
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

const LoadingEidolonTable = () => {
  const Row = ({ keys }: { keys: number[] }) => (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((key) => (
        <Toggle
          key={key}
          pressed={key === 1}
          className="flex h-full flex-1 flex-col justify-start gap-2 py-2 sm:flex-row"
        >
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Badge className="w-fit sm:inline">E{key}</Badge>
          </div>
          <span className="md:text-lg"> </span>
        </Toggle>
      ))}
    </div>
  );
  return (
    <>
      <Row keys={[1, 2, 3]} />
      <div className="my-2 min-h-[8rem] whitespace-pre-wrap rounded-md border p-4" />
      <Row keys={[6, 5, 4]} />
    </>
  );
};

export { EidolonTable, LoadingEidolonTable };
