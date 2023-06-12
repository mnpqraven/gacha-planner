export type BattlePassType = "None" | "Basic" | "Premium";

export type EqTier = "Zero" | "One" | "Two" | "Three" | "Four" | "Five" | "Six";

export type Server = "Asia" | "America" | "Europe";

export interface EstimateCfg {
  battlePass: BattlePassOption;
  currentJades?: number | null;
  currentRolls?: number | null;
  eq: EqTier;
  moc: number;
  railPass: RailPassCfg;
  server: Server;
  untilDate: SimpleDate;
  [k: string]: unknown;
}

export interface BattlePassOption {
  battlePassType: BattlePassType;
  currentLevel: number;
  [k: string]: unknown;
}

export interface RailPassCfg {
  daysLeft?: number | null;
  useRailPass: boolean;
  [k: string]: unknown;
}

export interface SimpleDate {
  day: number;
  month: number;
  year: number;
  [k: string]: unknown;
}