export type Anchor =
  | "Point01"
  | "Point02"
  | "Point03"
  | "Point04"
  | "Point05"
  | "Point06"
  | "Point07"
  | "Point08"
  | "Point09"
  | "Point10"
  | "Point11"
  | "Point12"
  | "Point13"
  | "Point14"
  | "Point15"
  | "Point16"
  | "Point17"
  | "Point18";

export type AssetPath = string;

export interface DbCharacterSkillTree {
  anchor: Anchor;
  icon: AssetPath;
  id: number;
  level_up_skills: SkillKV[];
  levels: SkillLevel[];
  max_level: number;
  pre_points: string[];
  [k: string]: unknown;
}

export interface SkillKV {
  id: number;
  num: number;
  [k: string]: unknown;
}

export interface SkillLevel {
  materials: MaterialKV[];
  promotion: number;
  properties: PropertyKV[];
  [k: string]: unknown;
}

export interface MaterialKV {
  id: number;
  num: number;
  [k: string]: unknown;
}

export interface PropertyKV {
  ttype: string;
  value: number;
  [k: string]: unknown;
}