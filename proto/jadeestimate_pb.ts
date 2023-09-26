// @generated by protoc-gen-es v1.3.1 with parameter "target=ts"
// @generated from file jadeestimate.proto (package jadeestimate, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from enum jadeestimate.Server
 */
export enum Server {
  /**
   * @generated from enum value: Asia = 0;
   */
  Asia = 0,

  /**
   * @generated from enum value: America = 1;
   */
  America = 1,

  /**
   * @generated from enum value: Europe = 2;
   */
  Europe = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(Server)
proto3.util.setEnumType(Server, "jadeestimate.Server", [
  { no: 0, name: "Asia" },
  { no: 1, name: "America" },
  { no: 2, name: "Europe" },
]);

/**
 * @generated from enum jadeestimate.EqTier
 */
export enum EqTier {
  /**
   * @generated from enum value: Zero = 0;
   */
  Zero = 0,

  /**
   * @generated from enum value: One = 1;
   */
  One = 1,

  /**
   * @generated from enum value: Two = 2;
   */
  Two = 2,

  /**
   * @generated from enum value: Three = 3;
   */
  Three = 3,

  /**
   * @generated from enum value: Four = 4;
   */
  Four = 4,

  /**
   * @generated from enum value: Five = 5;
   */
  Five = 5,

  /**
   * @generated from enum value: Six = 6;
   */
  Six = 6,
}
// Retrieve enum metadata with: proto3.getEnumType(EqTier)
proto3.util.setEnumType(EqTier, "jadeestimate.EqTier", [
  { no: 0, name: "Zero" },
  { no: 1, name: "One" },
  { no: 2, name: "Two" },
  { no: 3, name: "Three" },
  { no: 4, name: "Four" },
  { no: 5, name: "Five" },
  { no: 6, name: "Six" },
]);

/**
 * @generated from enum jadeestimate.BattlePassType
 */
export enum BattlePassType {
  /**
   * @generated from enum value: None = 0;
   */
  None = 0,

  /**
   * @generated from enum value: Basic = 1;
   */
  Basic = 1,

  /**
   * @generated from enum value: Premium = 2;
   */
  Premium = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(BattlePassType)
proto3.util.setEnumType(BattlePassType, "jadeestimate.BattlePassType", [
  { no: 0, name: "None" },
  { no: 1, name: "Basic" },
  { no: 2, name: "Premium" },
]);

/**
 * @generated from enum jadeestimate.RewardFrequency
 */
export enum RewardFrequency {
  /**
   * @generated from enum value: Daily = 0;
   */
  Daily = 0,

  /**
   * @generated from enum value: Weekly = 1;
   */
  Weekly = 1,

  /**
   * @generated from enum value: BiWeekly = 2;
   */
  BiWeekly = 2,

  /**
   * @generated from enum value: Monthly = 3;
   */
  Monthly = 3,

  /**
   * @generated from enum value: WholePatch = 4;
   */
  WholePatch = 4,

  /**
   * @generated from enum value: HalfPatch = 5;
   */
  HalfPatch = 5,

  /**
   * @generated from enum value: OneTime = 6;
   */
  OneTime = 6,
}
// Retrieve enum metadata with: proto3.getEnumType(RewardFrequency)
proto3.util.setEnumType(RewardFrequency, "jadeestimate.RewardFrequency", [
  { no: 0, name: "Daily" },
  { no: 1, name: "Weekly" },
  { no: 2, name: "BiWeekly" },
  { no: 3, name: "Monthly" },
  { no: 4, name: "WholePatch" },
  { no: 5, name: "HalfPatch" },
  { no: 6, name: "OneTime" },
]);

/**
 * @generated from message jadeestimate.JadeEstimateCfg
 */
export class JadeEstimateCfg extends Message<JadeEstimateCfg> {
  /**
   * @generated from field: jadeestimate.Server server = 1;
   */
  server = Server.Asia;

  /**
   * @generated from field: jadeestimate.SimpleDate until_date = 2;
   */
  untilDate?: SimpleDate;

  /**
   * @generated from field: jadeestimate.RailPassCfg rail_pass = 3;
   */
  railPass?: RailPassCfg;

  /**
   * @generated from field: jadeestimate.BattlePassOption battle_pass = 4;
   */
  battlePass?: BattlePassOption;

  /**
   * @generated from field: jadeestimate.EqTier eq = 5;
   */
  eq = EqTier.Zero;

  /**
   * @generated from field: uint32 moc = 6;
   */
  moc = 0;

  /**
   * @generated from field: bool moc_current_week_done = 7;
   */
  mocCurrentWeekDone = false;

  /**
   * @generated from field: optional int32 current_rolls = 8;
   */
  currentRolls?: number;

  /**
   * @generated from field: optional int32 current_jades = 9;
   */
  currentJades?: number;

  /**
   * @generated from field: optional uint32 daily_refills = 10;
   */
  dailyRefills?: number;

  constructor(data?: PartialMessage<JadeEstimateCfg>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "jadeestimate.JadeEstimateCfg";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "server", kind: "enum", T: proto3.getEnumType(Server) },
    { no: 2, name: "until_date", kind: "message", T: SimpleDate },
    { no: 3, name: "rail_pass", kind: "message", T: RailPassCfg },
    { no: 4, name: "battle_pass", kind: "message", T: BattlePassOption },
    { no: 5, name: "eq", kind: "enum", T: proto3.getEnumType(EqTier) },
    { no: 6, name: "moc", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 7, name: "moc_current_week_done", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 8, name: "current_rolls", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
    { no: 9, name: "current_jades", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
    { no: 10, name: "daily_refills", kind: "scalar", T: 13 /* ScalarType.UINT32 */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): JadeEstimateCfg {
    return new JadeEstimateCfg().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): JadeEstimateCfg {
    return new JadeEstimateCfg().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): JadeEstimateCfg {
    return new JadeEstimateCfg().fromJsonString(jsonString, options);
  }

  static equals(a: JadeEstimateCfg | PlainMessage<JadeEstimateCfg> | undefined, b: JadeEstimateCfg | PlainMessage<JadeEstimateCfg> | undefined): boolean {
    return proto3.util.equals(JadeEstimateCfg, a, b);
  }
}

/**
 * @generated from message jadeestimate.JadeEstimateResponse
 */
export class JadeEstimateResponse extends Message<JadeEstimateResponse> {
  /**
   * @generated from field: int32 days = 1;
   */
  days = 0;

  /**
   * @generated from field: int32 rolls = 2;
   */
  rolls = 0;

  /**
   * @generated from field: int32 total_jades = 3;
   */
  totalJades = 0;

  /**
   * @generated from field: repeated jadeestimate.RewardSource sources = 4;
   */
  sources: RewardSource[] = [];

  constructor(data?: PartialMessage<JadeEstimateResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "jadeestimate.JadeEstimateResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "days", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "rolls", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "total_jades", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 4, name: "sources", kind: "message", T: RewardSource, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): JadeEstimateResponse {
    return new JadeEstimateResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): JadeEstimateResponse {
    return new JadeEstimateResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): JadeEstimateResponse {
    return new JadeEstimateResponse().fromJsonString(jsonString, options);
  }

  static equals(a: JadeEstimateResponse | PlainMessage<JadeEstimateResponse> | undefined, b: JadeEstimateResponse | PlainMessage<JadeEstimateResponse> | undefined): boolean {
    return proto3.util.equals(JadeEstimateResponse, a, b);
  }
}

/**
 * @generated from message jadeestimate.SimpleDate
 */
export class SimpleDate extends Message<SimpleDate> {
  /**
   * @generated from field: uint32 day = 1;
   */
  day = 0;

  /**
   * @generated from field: uint32 month = 2;
   */
  month = 0;

  /**
   * @generated from field: uint32 year = 3;
   */
  year = 0;

  constructor(data?: PartialMessage<SimpleDate>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "jadeestimate.SimpleDate";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "day", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "month", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 3, name: "year", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SimpleDate {
    return new SimpleDate().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SimpleDate {
    return new SimpleDate().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SimpleDate {
    return new SimpleDate().fromJsonString(jsonString, options);
  }

  static equals(a: SimpleDate | PlainMessage<SimpleDate> | undefined, b: SimpleDate | PlainMessage<SimpleDate> | undefined): boolean {
    return proto3.util.equals(SimpleDate, a, b);
  }
}

/**
 * @generated from message jadeestimate.RailPassCfg
 */
export class RailPassCfg extends Message<RailPassCfg> {
  /**
   * @generated from field: bool use_rail_pass = 1;
   */
  useRailPass = false;

  /**
   * @generated from field: optional uint32 days_left = 2;
   */
  daysLeft?: number;

  constructor(data?: PartialMessage<RailPassCfg>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "jadeestimate.RailPassCfg";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "use_rail_pass", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 2, name: "days_left", kind: "scalar", T: 13 /* ScalarType.UINT32 */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RailPassCfg {
    return new RailPassCfg().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RailPassCfg {
    return new RailPassCfg().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RailPassCfg {
    return new RailPassCfg().fromJsonString(jsonString, options);
  }

  static equals(a: RailPassCfg | PlainMessage<RailPassCfg> | undefined, b: RailPassCfg | PlainMessage<RailPassCfg> | undefined): boolean {
    return proto3.util.equals(RailPassCfg, a, b);
  }
}

/**
 * @generated from message jadeestimate.BattlePassOption
 */
export class BattlePassOption extends Message<BattlePassOption> {
  /**
   * @generated from field: jadeestimate.BattlePassType battle_pass_type = 1;
   */
  battlePassType = BattlePassType.None;

  /**
   * @generated from field: uint32 current_level = 2;
   */
  currentLevel = 0;

  constructor(data?: PartialMessage<BattlePassOption>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "jadeestimate.BattlePassOption";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "battle_pass_type", kind: "enum", T: proto3.getEnumType(BattlePassType) },
    { no: 2, name: "current_level", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): BattlePassOption {
    return new BattlePassOption().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): BattlePassOption {
    return new BattlePassOption().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): BattlePassOption {
    return new BattlePassOption().fromJsonString(jsonString, options);
  }

  static equals(a: BattlePassOption | PlainMessage<BattlePassOption> | undefined, b: BattlePassOption | PlainMessage<BattlePassOption> | undefined): boolean {
    return proto3.util.equals(BattlePassOption, a, b);
  }
}

/**
 * @generated from message jadeestimate.RewardSource
 */
export class RewardSource extends Message<RewardSource> {
  /**
   * @generated from field: string source = 1;
   */
  source = "";

  /**
   * @generated from field: jadeestimate.RewardFrequency source_type = 4;
   */
  sourceType = RewardFrequency.Daily;

  /**
   * @generated from field: optional int32 jades_amount = 2;
   */
  jadesAmount?: number;

  /**
   * @generated from field: optional int32 rolls_amount = 3;
   */
  rollsAmount?: number;

  /**
   * @generated from field: optional string description = 5;
   */
  description?: string;

  constructor(data?: PartialMessage<RewardSource>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "jadeestimate.RewardSource";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "source", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "source_type", kind: "enum", T: proto3.getEnumType(RewardFrequency) },
    { no: 2, name: "jades_amount", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
    { no: 3, name: "rolls_amount", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
    { no: 5, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RewardSource {
    return new RewardSource().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RewardSource {
    return new RewardSource().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RewardSource {
    return new RewardSource().fromJsonString(jsonString, options);
  }

  static equals(a: RewardSource | PlainMessage<RewardSource> | undefined, b: RewardSource | PlainMessage<RewardSource> | undefined): boolean {
    return proto3.util.equals(RewardSource, a, b);
  }
}

