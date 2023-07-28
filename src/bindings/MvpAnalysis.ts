export interface MvpAnalysis {
  data: {
    [k: string]: CharacterDamage[];
  };
}

export interface CharacterDamage {
  self_distribution: DamageSelfDistribution;
  team_distribution: InTeamDistribution;
  turn: number;
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