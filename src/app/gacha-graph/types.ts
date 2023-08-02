import { PlainMessage } from "@bufbuild/protobuf";
import { BannerType, ProbabilityRatePayload } from "@grpc/probabilityrate_pb";

export const defaultGachaQuery: PlainMessage<ProbabilityRatePayload> = {
  currentEidolon: -1,
  pity: 0,
  pulls: 0,
  nextGuaranteed: false,
  enpitomizedPity: undefined,
  banner: BannerType.SSR,
};
