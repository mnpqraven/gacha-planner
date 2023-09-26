// @generated by protoc-gen-connect-es v1.0.0 with parameter "target=ts,import_extension=none"
// @generated from file probabilityrate.proto (package probabilityrate, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { ProbabilityRatePayload, ProbabilityRateResponse } from "./probabilityrate_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service probabilityrate.ProbabilityRateService
 */
export const ProbabilityRateService = {
  typeName: "probabilityrate.ProbabilityRateService",
  methods: {
    /**
     * @generated from rpc probabilityrate.ProbabilityRateService.Post
     */
    post: {
      name: "Post",
      I: ProbabilityRatePayload,
      O: ProbabilityRateResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

