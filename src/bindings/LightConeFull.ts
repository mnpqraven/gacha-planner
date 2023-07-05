export type Path = "Destruction" | "Hunt" | "Erudition" | "Harmony" | "Nihility" | "Preservation" | "Abundance";

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
/**
 * Usually served to the front end and connect string slices there
 */

export type ParameterizedDescription = string[];

export interface LightCone {
  metadata: EquipmentConfigMerged;
  skill: EquipmentSkillConfigMerged;
  [k: string]: unknown;
}

export interface EquipmentConfigMerged {
  avatar_base_type: Path;
  coin_cost: number;
  equipment_desc: string;
  equipment_id: number;
  equipment_name: string;
  exp_provide: number;
  exp_type: number;
  max_promotion: number;
  max_rank: number;
  rank_up_cost_list: number[];
  rarity: number;
  release: boolean;
  skill_id: number;
  [k: string]: unknown;
}

export interface EquipmentSkillConfigMerged {
  ability_name: string;
  /**
   * merge
   */
  ability_property: AbilityProperty[][];
  /**
   * merge
   */
  param_list: string[][];
  skill_desc: ParameterizedDescription;
  skill_id: number;
  /**
   * merge
   */
  skill_name: string;
  [k: string]: unknown;
}

export interface AbilityProperty {
  property_type: Property;
  value: Param;
  [k: string]: unknown;
}

export interface Param {
  value: number;
  [k: string]: unknown;
}