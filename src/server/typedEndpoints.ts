import { serverFetch } from "./serverFetch";
import { SignatureAtlas } from "@/bindings/SignatureAtlas";
import { List } from "@/lib/generics";
import { AvatarConfig } from "@/bindings/AvatarConfig";
import { SkillTreeConfig } from "@/bindings/SkillTreeConfig";
import { AvatarSkillConfig } from "@/bindings/AvatarSkillConfig";
import { EquipmentConfig } from "@/bindings/EquipmentConfig";
import { EquipmentSkillConfig } from "@/bindings/EquipmentSkillConfig";
import { EquipmentRanking } from "@/bindings/EquipmentRanking";
import { AvatarPropertyConfig } from "@/bindings/AvatarPropertyConfig";
import { AvatarRankConfig } from "@/bindings/AvatarRankConfig";
import { Patch } from "@/bindings/Patch";
import { PatchBanner } from "@/bindings/PatchBanner";
import { createPromiseClient } from "@bufbuild/connect";
import { createGrpcWebTransport } from "@bufbuild/connect-web";
import { ServiceType } from "@bufbuild/protobuf";
import { env } from "@/envSchema.mjs";
import { EquipmentPromotionConfig } from "@/bindings/EquipmentPromotionConfig";
import { AvatarPromotionConfig } from "@/bindings/AvatarPromotionConfig";

const API = {
  patchDates: route<List<Patch>>("/honkai/patch_dates", "GET"),
  patchBanners: route<List<PatchBanner>>("/honkai/patch_banners", "GET"),
  lightConeMetadata: route<EquipmentConfig>(
    "/honkai/light_cone/:id/metadata",
    "GET"
  ),
  lightConeMetadataMany: route<List<number>, List<EquipmentConfig>>(
    "/honkai/light_cone/metadata"
  ),
  lightConeSkill: route<EquipmentSkillConfig>(
    "/honkai/light_cone/:id/skill",
    "GET"
  ),
  lightConeSkillMany: route<List<number>, List<EquipmentSkillConfig>>(
    "/honkai/light_cone/skill"
  ),
  lightConeRanking: route<List<EquipmentRanking>>(
    "/honkai/light_cone/ranking",
    "GET"
  ),
  lightConePromotion: route<EquipmentPromotionConfig>(
    "/honkai/light_cone/:id/promotion",
    "GET"
  ),
  character: route<AvatarConfig>("/honkai/avatar", "GET"),
  characters: route<List<number>, List<AvatarConfig>>("/honkai/avatar"),
  signatureAtlas: route<List<SignatureAtlas>>("/honkai/signature_atlas", "GET"),
  skillsByCharId: route<List<AvatarSkillConfig>>(
    "/honkai/avatar/:id/skill",
    "GET"
  ),
  trace: route<List<SkillTreeConfig>>("/honkai/avatar/:id/trace", "GET"),
  properties: route<List<AvatarPropertyConfig>>("/honkai/properties", "GET"),
  eidolon: route<List<AvatarRankConfig>>("/honkai/avatar/:id/eidolon", "GET"),
  promotion: route<AvatarPromotionConfig>(
    "/honkai/avatar/:id/promotion",
    "GET"
  ),
};

type ApiRoute = {
  path: string;
};
type ApiGet<TResponse> = {
  get: (params?: string | number) => Promise<TResponse>;
};
type ApiPost<TPayload, TResponse> = {
  post: (opt?: { payload?: TPayload; params?: string }) => Promise<TResponse>;
};

type Get<TRes> = ApiRoute & ApiGet<TRes>;
type Post<TReq, TRes> = ApiRoute & ApiPost<TReq, TRes>;
type GetPost<TReq, TRes> = ApiRoute & ApiGet<TRes> & ApiPost<TReq, TRes>;

type Method = "GET" | "POST" | undefined;
function route<TReq, TRes>(path: string): GetPost<TReq, TRes>;
function route<TRes>(path: string, method: "GET"): Get<TRes>;
function route<TReq, TRes>(path: string, method: "POST"): Post<TReq, TRes>;
function route<TReq, TRes>(
  path: string,
  method?: Method
): Get<TRes> | Post<TReq, TRes> | GetPost<TReq, TRes> {
  switch (method) {
    case "GET":
      return {
        path,
        get: async (params?: string | number) =>
          await serverFetch<TReq, TRes>(path, undefined, params),
      };
    case "POST":
      return {
        path,
        post: async (opt?: { payload?: TReq; params?: string }) =>
          await serverFetch<TReq, TRes>(
            path,
            { payload: opt?.payload, method: "POST" },
            opt?.params
          ),
      };
    default:
      return {
        // no method provided, allow both post and fetch
        path,
        get: async (params?: string | number) =>
          await serverFetch<TReq, TRes>(path, undefined, params),
        post: async (opt?: { payload?: TReq; params?: string }) =>
          await serverFetch<TReq, TRes>(
            path,
            { payload: opt?.payload, method: "POST" },
            opt?.params
          ),
      };
  }
}

export function rpc<T extends ServiceType>(service: T) {
  const client = createPromiseClient(
    service,
    createGrpcWebTransport({
      baseUrl: `${env.NEXT_PUBLIC_WORKER_API}/rpc`,
    })
  );
  return client;
}

export default API;
