import { Element, Path } from "@/bindings/AvatarConfig";
import { AssetPath, SkillType } from "@/bindings/AvatarSkillConfig";
import { Anchor, Property } from "@/bindings/SkillTreeConfig";
import { Field } from "./[uid]/_components/SpiderChartWrapper";

export interface MihomoResponse {
  player: MihomoPlayer;
  characters: MihomoCharacter[];
}

export interface MihomoPlayer {
  uid: string;
  nickname: string;
  level: number;
  world_level: number;
  friend_count: number;
  avatar: {
    id: string;
    name: string;
    icon: AssetPath;
  };
  signature: string;
  is_display: boolean;
  space_info: {
    challenge_data: {
      maze_group_id: number;
      maze_group_index: number;
      pre_maze_group_index: number;
    };
    pass_area_progress: number;
    light_cone_count: number;
    avatar_count: number;
    achievement_count: number;
  };
}

export interface MihomoCharacter {
  id: number;
  name: string;
  rarity: number;
  rank: number;
  level: number;
  promotion: number;
  icon: AssetPath;
  preview: AssetPath;
  portrait: AssetPath;
  rank_icons: AssetPath[];
  path: MihomoPath;
  element: MihomoElementConfig;
  skills: MihomoSkillConfig[];
  skill_trees: MihomoSkillTreeConfig[];
  light_cone: MihomoLightConeConfig;
  relics: MihomoRelicConfig[];
  relic_sets: MihomoRelicSetConfig[];
  attributes: MihomoAttributeConfig[];
  /** added stat from relic
   * */
  additions: MihomoAttributeConfig[];
  /** base stat of a character at specific level and light cone
   * */
  properties: MihomoPropertyConfig[];
}

export interface MihomoLightConeConfig {
  id: string;
  name: string;
  rarity: number;
  rank: number;
  level: number;
  promotion: number;
  icon: AssetPath;
  preview: AssetPath;
  portrait: AssetPath;
  path: MihomoPath;
  attributes: MihomoAttributeConfig[];
  properties: MihomoPropertyConfig[];
}

export type Color = string;

export interface MihomoSkillConfig {
  id: string;
  name: string;
  level: number;
  max_level: number;
  element?: MihomoElementConfig;
  type: SkillType;
  type_text: string;
  effect: string;
  effect_text: string;
  simple_desc: string;
  desc: string;
  icon: string;
}

export interface MihomoElementConfig {
  id: string;
  name: Element;
  color: Color;
  icon: AssetPath;
}

export interface MihomoSkillTreeConfig {
  id: string; // ID
  level: number;
  anchor: Anchor;
  max_level: number;
  icon: AssetPath;
  parent?: string; // skill ID
}

export interface MihomoPath {
  id: string;
  name: Exclude<Path, "Hunt"> | "The Hunt";
  icon: AssetPath;
}

export interface MihomoAttributeConfig {
  field: Field;
  name: string;
  icon: AssetPath;
  value: number;
  display: string;
  percent: boolean;
}

export interface MihomoPropertyConfig {
  type: Property;
  field: Field;
  name: string;
  icon: AssetPath;
  value: number;
  display: string;
  percent: boolean;
}

export interface MihomoRelicConfig {
  id: string;
  name: string;
  set_id: string;
  set_name: string;
  rarity: number;
  level: number;
  icon: AssetPath;
  main_affix?: MihomoPropertyConfig;
  sub_affix: MihomoSubAffixInfo[];
}

export interface MihomoSubAffixInfo {
  type: Property;
  field: string;
  name: string;
  icon: AssetPath;
  value: number;
  display: string;
  percent: boolean;
  count: number;
  step: number;
}

export interface MihomoRelicSetConfig {
  id: string;
  name: string;
  icon: AssetPath;
  num: number;
  desc: string;
  properties: MihomoPropertyConfig[];
}
