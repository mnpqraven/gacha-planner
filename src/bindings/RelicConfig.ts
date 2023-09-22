export type RelicType = "HEAD" | "HAND" | "BODY" | "FOOT" | "OBJECT" | "NECK";

export interface RelicConfig {
  coin_cost: number;
  exp_provide: number;
  exp_type: number;
  id: number;
  main_affix_group: number;
  max_level: number;
  rarity: number;
  set_id: number;
  sub_affix_group: number;
  ttype: RelicType;
}