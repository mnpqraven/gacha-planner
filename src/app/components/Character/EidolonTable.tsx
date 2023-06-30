import { DbCharacterEidolon } from "@/bindings/DbCharacterEidolon";
import ENDPOINT from "@/server/endpoints";
import { typedFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Toggle } from "../ui/Toggle";

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
      <div className="flex gap-2">
        {top &&
          top.map((eidolon) => (
            <Toggle
              key={eidolon.id}
              className="h-fit flex-1"
              pressed={selectedEidolon === eidolon.rank}
              onPressedChange={() => setSelectedEidolon(eidolon.rank)}
            >
              <Image
                src={url(characterId, eidolon.rank)}
                alt={eidolon.name}
                onClick={() => setSelectedEidolon(eidolon.rank)}
                width={64}
                height={64}
              />
              {eidolon.name}
            </Toggle>
          ))}
      </div>
      <div className="border rounded-md p-4 my-4 min-h-[8rem]">
        {data?.list.find((e) => e.rank == selectedEidolon)?.desc}
      </div>
      <div className="flex gap-2">
        {bottom &&
          bottom.map((eidolon) => (
            <Toggle
              key={eidolon.id}
              className="h-fit flex-1"
              pressed={selectedEidolon === eidolon.rank}
              onPressedChange={() => setSelectedEidolon(eidolon.rank)}
            >
              <Image
                src={url(characterId, eidolon.rank)}
                onClick={() => setSelectedEidolon(eidolon.rank)}
                alt={eidolon.name}
                width={64}
                height={64}
              />
              {eidolon.name}
            </Toggle>
          ))}
      </div>
    </>
  );
};

function url(charID: number, eidolon: number) {
  let fmt = `rank${eidolon}`;
  if (eidolon == 3) fmt = "skill";
  if (eidolon == 5) fmt = "ultimate";
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${charID}_${fmt}.png`;
}
export { EidolonTable };
