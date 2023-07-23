import { AvatarConfig, Element, Path } from "@/bindings/AvatarConfig";
import { useState } from "react";

export default function useCharacterFilter() {
  const [rarity, setRarity] = useState<number[]>([]);
  const [path, setPath] = useState<Path[]>([]);
  const [element, setElement] = useState<Element[]>([]);

  const rarityFilter = (e: AvatarConfig) => {
    if (rarity.length === 0) return true;
    return rarity.includes(e.rarity);
  };

  const pathFilter = (e: AvatarConfig) => {
    if (path.length === 0) return true;
    return path.includes(e.avatar_base_type);
  };

  const elementFilter = (e: AvatarConfig) => {
    if (element.length === 0) return true;
    return element.includes(e.damage_type);
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

  function updateElement(value: Element) {
    // remove
    if (element.includes(value)) {
      const next = [...element];
      next.splice(element.indexOf(value), 1);
      setElement(next);
    } else {
      // add
      const next = [...element, value].sort();
      setElement(next);
    }
  }

  return {
    byRarity: rarityFilter,
    byPath: pathFilter,
    byElement: elementFilter,
    updateRarity,
    updatePath,
    updateElement,
  };
}
