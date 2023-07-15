export type AssetPath = string;

export interface DbCharacterEidolon {
  desc: string;
  icon: AssetPath;
  id: number;
  level_up_skills: SkillKV[];
  materials: MaterialKV[];
  name: string;
  rank: number;
}

export interface SkillKV {
  id: number;
  num: number;
}

export interface MaterialKV {
  id: number;
  num: number;
}