import { EquipmentConfig, Path } from "@/bindings/EquipmentConfig";
import { useState } from "react";

export default function useLightConeFilter() {
  const [rarity, setRarity] = useState<number[]>([]);
  const [path, setPath] = useState<Path[]>([]);
  const [query, updateQuery] = useState<string | undefined>(undefined);

  const rarityFilter = (e: EquipmentConfig) => {
    if (rarity.length === 0) return true;
    return rarity.includes(e.rarity);
  };

  const pathFilter = (e: EquipmentConfig) => {
    if (path.length === 0) return true;
    return path.includes(e.avatar_base_type);
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
    filter: {
      byRarity: rarityFilter,
      byPath: pathFilter,
      updateRarity,
      updatePath,
    },
    query,
    updateQuery,
  };
}
