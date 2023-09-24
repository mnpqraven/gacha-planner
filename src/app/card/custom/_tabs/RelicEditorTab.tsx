"use client";

import { useAtom } from "jotai";
import { RelicEditor } from "../_editor/_relic/RelicEditor";
import { splitRelicAtom } from "../../_store";
import { RelicSelector } from "../_editor/_relic/RelicSelector";

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
