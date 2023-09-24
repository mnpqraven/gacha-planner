"use client";

import { PrimitiveAtom, useAtom } from "jotai";
import { useRelicSets } from "@/hooks/queries/useRelicSetList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import Image from "next/image";
import { img } from "@/lib/utils";
import { RelicSetConfig } from "@/bindings/RelicSetConfig";
import { RelicEditor } from "../_editor/_relic/RelicEditor";
import { splitRelicAtom } from "../../_store";
import { RelicInput } from "../../_store/relic";
import { RelicType } from "@/bindings/RelicConfig";

export function RelicEditorTab() {
  const [relicAtoms] = useAtom(splitRelicAtom);
  return (
    <div className="grid grid-cols-2 gap-2">
      {relicAtoms.map((relicAtom) => (
        <div
          key={`${relicAtom}`}
          className="flex flex-col gap-2 rounded-md border p-2"
        >
          <RelicSelector atom={relicAtom} />
          <RelicEditor atom={relicAtom} />
        </div>
      ))}
    </div>
  );
}

function RelicSelector({ atom }: { atom: PrimitiveAtom<RelicInput> }) {
  const [relic, setRelic] = useAtom(atom);
  const { data: relicSets } = useRelicSets();

  function updateRelic(sId: string) {
    const setId = parseInt(sId);
    setRelic((relic) => ({ ...relic, setId: setId }));
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-bold">{relicTypeName(relic.type)}</span>

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
