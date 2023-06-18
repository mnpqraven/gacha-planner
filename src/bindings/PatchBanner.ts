export type AssetPath = string;

export type Element = "Fire" | "Ice" | "Physical" | "Wind" | "Lightning" | "Quantum" | "Imaginary";

export type SkillType = "Normal" | "BPSkill" | "Ultra" | "Talent" | "MazeNormal" | "Maze";

export type PatchVersion = string;

export interface PatchBanner {
  characterId?: number | null;
  characterName: string;
  dateEnd: string;
  dateStart: string;
  element?: CharacterElement | null;
  icon?: AssetPath | null;
  skills: SimpleSkill[];
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

export interface SimpleSkill {
  description: string[];
  name: string;
  params: string[][];
  ttype: SkillType;
  [k: string]: unknown;
}