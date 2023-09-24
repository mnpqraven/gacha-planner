import { RelicInput } from "@/app/card/_store/relic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { RelicType } from "@/bindings/RelicConfig";
import { RelicSetConfig } from "@/bindings/RelicSetConfig";
import { useRelicSets } from "@/hooks/queries/useRelicSetList";
import { img } from "@/lib/utils";
import { PrimitiveAtom, useAtom } from "jotai";
import Image from "next/image";
import { MainstatEditor } from "./MainstatEditor";
import { RelicLevel } from "./RelicLevel";

interface Props {
  atom: PrimitiveAtom<RelicInput>;
}
export function RelicSelector({ atom }: Props) {
  const [relic, setRelic] = useAtom(atom);
  const { data: relicSets } = useRelicSets();

  function updateRelic(sId: string) {
    const setId = parseInt(sId);
    setRelic((relic) => ({ ...relic, setId: setId }));
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-bold grow">{relicTypeName(relic.type)}</span>

      <RelicLevel atom={atom} />

      <MainstatEditor atom={atom} />

      <Select onValueChange={updateRelic} value={`${relic.setId}`}>
        <SelectTrigger className="w-96">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-full overflow-y-auto">
          {relicSets?.filter(bySeparateType(relic.type)).map((set) => (
            <SelectItem key={set.set_id} value={String(set.set_id)}>
              <div className="flex items-center gap-2">
                <Image
                  src={img(`icon/relic/${set.set_id}.png`)}
                  alt=""
                  height={32}
                  width={32}
                />

                {set.set_name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function bySeparateType(type: RelicType) {
  switch (type) {
    case "HEAD":
    case "HAND":
    case "BODY":
    case "FOOT":
      return (set: RelicSetConfig) =>
        set.set_skill_list.some((num) => num == 4);
    case "OBJECT":
    case "NECK":
      return (set: RelicSetConfig) =>
        set.set_skill_list.every((num) => num <= 2);
  }
}

function relicTypeName(type: RelicType) {
  switch (type) {
    case "HEAD":
      return "Head";
    case "HAND":
      return "Glove";
    case "BODY":
      return "Body";
    case "FOOT":
      return "Boot";
    case "OBJECT":
      return "Planar Sphere";
    case "NECK":
      return "Link Robe";
  }
}
