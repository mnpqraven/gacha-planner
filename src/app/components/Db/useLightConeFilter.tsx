import { Path } from "@/bindings/DbCharacter";
import { LightCone } from "@/bindings/LightConeFull";
import { useState } from "react";

export default function useLightConeFilter() {
  const [rarity, setRarity] = useState<number[]>([]);
  const [path, setPath] = useState<Path[]>([]);

  const rarityFilter = (e: LightCone) => {
    if (rarity.length === 0) return true;
    return rarity.includes(e.metadata.rarity);
  };

  const pathFilter = (e: LightCone) => {
    if (path.length === 0) return true;
    return path.includes(e.metadata.avatar_base_type);
  };

  function updateRarity(value: number) {
    // remove
    if (rarity.includes(value)) {
      const next = [...rarity];
      next.splice(rarity.indexOf(value), 1);
      setRarity(next);
    } else {
      // add
      const next = [...rarity, value].sort();
      setRarity(next);
    }
  }

  function updatePath(value: Path) {
    // remove
    if (path.includes(value)) {
      const next = [...path];
      next.splice(path.indexOf(value), 1);
      setPath(next);
    } else {
      // add
      const next = [...path, value].sort();
      setPath(next);
    }
  }

  return {
    byRarity: rarityFilter,
    byPath: pathFilter,
    updateRarity,
    updatePath,
  };
}
