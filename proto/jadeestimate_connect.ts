// @generated by protoc-gen-connect-es v0.12.0 with parameter "target=ts,import_extension=none"
// @generated from file jadeestimate.proto (package jadeestimate, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { JadeEstimateCfg, JadeEstimateResponse } from "./jadeestimate_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service jadeestimate.JadeEstimateService
 */
export const JadeEstimateService = {
  typeName: "jadeestimate.JadeEstimateService",
  methods: {
    /**
     * @generated from rpc jadeestimate.JadeEstimateService.Post
     */
    post: {
      name: "Post",
      I: JadeEstimateCfg,
      O: JadeEstimateResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

