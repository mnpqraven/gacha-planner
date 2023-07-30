// @generated by protoc-gen-es v1.3.0 with parameter "target=ts"
// @generated from file atlas.proto (package dm.atlas, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message dm.atlas.SignatureReturns
 */
export class SignatureReturns extends Message<SignatureReturns> {
  /**
   * @generated from field: repeated dm.atlas.SignatureReturn list = 1;
   */
  list: SignatureReturn[] = [];

  constructor(data?: PartialMessage<SignatureReturns>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "dm.atlas.SignatureReturns";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "list", kind: "message", T: SignatureReturn, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignatureReturns {
    return new SignatureReturns().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignatureReturns {
    return new SignatureReturns().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignatureReturns {
    return new SignatureReturns().fromJsonString(jsonString, options);
  }

  static equals(a: SignatureReturns | PlainMessage<SignatureReturns> | undefined, b: SignatureReturns | PlainMessage<SignatureReturns> | undefined): boolean {
    return proto3.util.equals(SignatureReturns, a, b);
  }
}

/**
 * @generated from message dm.atlas.What
 */
export class What extends Message<What> {
  constructor(data?: PartialMessage<What>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "dm.atlas.What";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): What {
    return new What().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): What {
    return new What().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): What {
    return new What().fromJsonString(jsonString, options);
  }

  static equals(a: What | PlainMessage<What> | undefined, b: What | PlainMessage<What> | undefined): boolean {
    return proto3.util.equals(What, a, b);
  }
}

/**
 * @generated from message dm.atlas.SignatureReturn
 */
export class SignatureReturn extends Message<SignatureReturn> {
  /**
   * @generated from field: uint32 char_id = 1;
   */
  charId = 0;

  /**
   * @generated from field: repeated uint32 lc_id = 2;
   */
  lcId: number[] = [];

  constructor(data?: PartialMessage<SignatureReturn>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "dm.atlas.SignatureReturn";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "char_id", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "lc_id", kind: "scalar", T: 13 /* ScalarType.UINT32 */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SignatureReturn {
    return new SignatureReturn().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SignatureReturn {
    return new SignatureReturn().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SignatureReturn {
    return new SignatureReturn().fromJsonString(jsonString, options);
  }

  static equals(a: SignatureReturn | PlainMessage<SignatureReturn> | undefined, b: SignatureReturn | PlainMessage<SignatureReturn> | undefined): boolean {
    return proto3.util.equals(SignatureReturn, a, b);
  }
}

