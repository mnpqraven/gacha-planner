export type AssetPath = string;

export type Element = "Fire" | "Ice" | "Physical" | "Wind" | "Lightning" | "Quantum" | "Imaginary";

export type Property =
  | "MaxHP"
  | "Attack"
  | "Defence"
  | "Speed"
  | "CriticalChance"
  | "CriticalDamage"
  | "BreakDamageAddedRatio"
  | "BreakDamageAddedRatioBase"
  | "HealRatio"
  | "MaxSP"
  | "SPRatio"
  | "StatusProbability"
  | "StatusResistance"
  | "CriticalChanceBase"
  | "CriticalDamageBase"
  | "HealRatioBase"
  | "StanceBreakAddedRatio"
  | "SPRatioBase"
  | "StatusProbabilityBase"
  | "StatusResistanceBase"
  | "PhysicalAddedRatio"
  | "PhysicalResistance"
  | "FireAddedRatio"
  | "FireResistance"
  | "IceAddedRatio"
  | "IceResistance"
  | "ThunderAddedRatio"
  | "ThunderResistance"
  | "WindAddedRatio"
  | "WindResistance"
  | "QuantumAddedRatio"
  | "QuantumResistance"
  | "ImaginaryAddedRatio"
  | "ImaginaryResistance"
  | "BaseHP"
  | "HPDelta"
  | "HPAddedRatio"
  | "BaseAttack"
  | "AttackDelta"
  | "AttackAddedRatio"
  | "BaseDefence"
  | "DefenceDelta"
  | "DefenceAddedRatio"
  | "BaseSpeed"
  | "HealTakenRatio"
  | "PhysicalResistanceDelta"
  | "FireResistanceDelta"
  | "IceResistanceDelta"
  | "ThunderResistanceDelta"
  | "WindResistanceDelta"
  | "QuantumResistanceDelta"
  | "ImaginaryResistanceDelta"
  | "SpeedDelta"
  | "SpeedAddedRatio"
  | "AllDamageTypeAddedRatio";

export type MainAffixType =
  | "HPDelta"
  | "AttackDelta"
  | "HPAddedRatio"
  | "AttackAddedRatio"
  | "DefenceAddedRatio"
  | "CriticalChanceBase"
  | "CriticalDamageBase"
  | "HealRatioBase"
  | "StatusProbabilityBase"
  | "SpeedDelta"
  | "PhysicalAddedRatio"
  | "FireAddedRatio"
  | "IceAddedRatio"
  | "ThunderAddedRatio"
  | "WindAddedRatio"
  | "QuantumAddedRatio"
  | "ImaginaryAddedRatio"
  | "BreakDamageAddedRatioBase"
  | "SPRatioBase";

export interface MihoResponse {
  characters: Character[];
  player: Player;
}

export interface Character {
  additions: Attribute[];
  attributes: Attribute[];
  element: CharacterElement;
  icon: AssetPath;
  id: string;
  level: number;
  light_cone: LightCone;
  name: string;
  path: CharacterPath;
  portrait: AssetPath;
  preview: AssetPath;
  promotion: number;
  properties: AttributeProperty[];
  rank: number;
  rank_icons: AssetPath[];
  rarity: number;
  relic_sets: RelicSet[];
  relics: Relic[];
  skill_trees: SkillTree[];
  skills: Skill[];
}

export interface Attribute {
  display: string;
  field: string;
  icon: AssetPath;
  name: string;
  percent: boolean;
  value: number;
}

export interface CharacterElement {
  color: string;
  icon: AssetPath;
  id: string;
  name: Element;
}

export interface LightCone {
  attributes: LightConeAttribute[];
  icon: AssetPath;
  id: number;
  level: number;
  name: string;
  path: CharacterPath;
  portrait: AssetPath;
  preview: AssetPath;
  promotion: number;
  properties: LightConeProperty[];
  rank: number;
  rarity: number;
}

export interface LightConeAttribute {
  display: string;
  field: string;
  icon: AssetPath;
  name: string;
  percent: boolean;
  value: number;
}

export interface CharacterPath {
  icon: AssetPath;
  id: string;
  name: string;
}

export interface LightConeProperty {
  display: string;
  field: string;
  icon: AssetPath;
  name: string;
  percent: boolean;
  type: string;
  value: number;
}

export interface AttributeProperty {
  display: string;
  field: string;
  icon: AssetPath;
  name: string;
  percent: boolean;
  type: Property;
  value: number;
}

export interface RelicSet {
  desc: string;
  icon: AssetPath;
  id: number;
  name: string;
  num: number;
  properties: AffixProperty[];
}

export interface AffixProperty {
  display: string;
  field: string;
  icon: AssetPath;
  name: string;
  percent: boolean;
  type: MainAffixType;
  value: number;
}

export interface Relic {
  icon: AssetPath;
  id: number;
  level: number;
  main_affix: AffixProperty;
  name: string;
  rarity: number;
  set_id: number;
  set_name: string;
  sub_affix: SubAffix[];
}

export interface SubAffix {
  count: number;
  display: string;
  field: string;
  icon: AssetPath;
  name: string;
  percent: boolean;
  step: number;
  type: string;
  value: number;
}

export interface SkillTree {
  icon: AssetPath;
  id: string;
  level: number;
}

export interface Skill {
  desc: string;
  effect: string;
  effect_text: string;
  element?: CharacterElement | null;
  icon: AssetPath;
  id: string;
  level: number;
  max_level: number;
  name: string;
  simple_desc: string;
  type: string;
  type_text: string;
}

export interface Player {
  avatar: Avatar;
  friend_count: number;
  is_display: boolean;
  level: number;
  nickname: string;
  signature: string;
  space_info: SpaceInfo;
  uid: string;
  world_level: number;
}

export interface Avatar {
  icon: AssetPath;
  id: string;
  name: string;
}

export interface SpaceInfo {
  achievement_count: number;
  avatar_count: number;
  challenge_data: ChallengeData;
  light_cone_count: number;
  pass_area_progress: number;
}

export interface ChallengeData {
  maze_group_id: number;
  maze_group_index: number;
  pre_maze_group_index: number;
}