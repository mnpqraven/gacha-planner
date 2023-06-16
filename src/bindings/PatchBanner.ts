export type AssetPath = string;

export type Element = "Fire" | "Ice" | "Physical" | "Wind" | "Lightning" | "Quantum" | "Imaginary";
/**
 * semver version
 */

export type PatchVersion = string;

export interface PatchBanner {
  characterName: string;
  dateEnd: string;
  dateStart: string;
  element?: CharacterElement | null;
  icon?: AssetPath | null;
  version: PatchVersion;
  [k: string]: unknown;
}

export interface CharacterElement {
  color: string;
  icon: AssetPath;
  id: string;
  name: Element;
  [k: string]: unknown;
}