export interface MvpAnalysis {
  data: [CharacterDamage, CharacterDamage, CharacterDamage, CharacterDamage][];
}

export interface CharacterDamage {
  name: string;
  self_distribution: DamageSelfDistribution;
  team_distribution: InTeamDistribution;
}

export interface DamageSelfDistribution {
  /**
   * @minItems 4
   * @maxItems 4
   */
  basic: [number, number, number, number];
  /**
   * @minItems 4
   * @maxItems 4
   */
  followup: [number, number, number, number];
  /**
   * @minItems 4
   * @maxItems 4
   */
  skill: [number, number, number, number];
  /**
   * @minItems 4
   * @maxItems 4
   */
  ult: [number, number, number, number];
}

export interface InTeamDistribution {
  rate: number;
}