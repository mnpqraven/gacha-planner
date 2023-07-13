export type AssetPath = string;

export type Element = "Fire" | "Ice" | "Physical" | "Wind" | "Lightning" | "Quantum" | "Imaginary";

export type SkillType = "Normal" | "BPSkill" | "Ultra" | "Talent" | "MazeNormal" | "Maze";

export type PatchVersion = string;

export interface PatchBanner {
  characterData: Character;
  dateEnd: string;
  dateStart: string;
  version: PatchVersion;
  [k: string]: unknown | undefined;
}

export interface Character {
  characterId?: number | null;
  characterName?: string | null;
  element?: CharacterElement | null;
  icon?: AssetPath | null;
  maxEnergy: number;
  skills: SimpleSkill[];
  [k: string]: unknown | undefined;
}

export interface CharacterElement {
  color: string;
  icon: AssetPath;
  id: string;
  name: Element;
  [k: string]: unknown | undefined;
}

export interface SimpleSkill {
  description: string[];
  id: number;
  name: string;
  params: string[][];
  ttype: SkillType;
  [k: string]: unknown | undefined;
}