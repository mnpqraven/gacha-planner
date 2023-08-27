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
import { Banner } from "@/bindings/Banner";

type CharId = { characterId: number };
type LcId = { lcId: number };
const API = {
  patchDates: get<List<Patch>>("/honkai/patch_dates"),
  lightConeMetadata: get<EquipmentConfig, LcId>(
    ({ lcId }) => `/honkai/light_cone/${lcId}/metadata`
  ),
  patchBanners: get<List<PatchBanner>>("/honkai/patch_banners"),
  lightConeMetadataMany: getPost<List<EquipmentConfig>, List<number>>(
    "/honkai/light_cone/metadata"
  ),
  lightConeSkill: get<EquipmentSkillConfig, LcId>(
    ({ lcId }) => `/honkai/light_cone/${lcId}/skill`
  ),
  lightConeSkillMany: getPost<List<EquipmentSkillConfig>, List<number>>(
    "/honkai/light_cone/skill"
  ),
  lightConeRanking: get<List<EquipmentRanking>>("/honkai/light_cone/ranking"),
  lightConePromotion: get<EquipmentPromotionConfig, LcId>(
    ({ lcId }) => `/honkai/light_cone/${lcId}/promotion`
  ),
  character: get<AvatarConfig, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}`
  ),
  characterByIds: getPost<List<AvatarConfig>, List<number>>("/honkai/avatar"),
  signatureAtlas: get<List<SignatureAtlas>>("/honkai/signature_atlas"),
  skillsByCharId: get<List<AvatarSkillConfig>, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}/skill`
  ),
  trace: get<List<SkillTreeConfig>, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}/trace`
  ),
  properties: get<List<AvatarPropertyConfig>>("/honkai/properties"),
  eidolon: get<List<AvatarRankConfig>, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}/eidolon`
  ),
  promotion: get<AvatarPromotionConfig, CharId>(
    ({ characterId }) => `/honkai/avatar/${characterId}/promotion`
  ),
  warpBanner: get<List<Banner>>("/honkai/warp_banners"),
};

type Get<TRes, P> = { get: (params: P) => Promise<TRes> };
type DirectGet<TRes> = { get: () => Promise<TRes> };
type Post<TRes, TPayload, P> = {
  post: (params: P, payload?: TPayload) => Promise<TRes>;
};
type DirectPost<TRes, TPayload> = {
  post: (payload?: TPayload) => Promise<TRes>;
};

// type ReturnDev<TRes, U> = { get: (params: U) => Promise<TRes> };
// type OptionalReturnDev<TRes> = { get: () => Promise<TRes> };

function get<TRes>(path: string): DirectGet<TRes>;
function get<TRes, TParam>(path: (t: TParam) => string): Get<TRes, TParam>;
function get<TRes, TParam>(
  path: string | ((params: TParam) => string)
): DirectGet<TRes> | Get<TRes, TParam> {
  if (typeof path === "string")
    return {
      get: async () => await serverFetch<unknown, TRes>(path),
    };

  return {
    get: async (params: TParam) =>
      await serverFetch<unknown, TRes>(path(params)),
  };
}

function post<TRes, TPayload>(
  path: string,
  payload?: TPayload
): DirectPost<TRes, TPayload>;
function post<TRes, TPayload, TParam>(
  path: (t: TParam) => string,
  payload?: TPayload
): Post<TRes, TPayload, TParam>;
function post<TRes, TPayload, TParam>(
  path: string | ((t: TParam) => string),
  payload?: TPayload
): DirectPost<TRes, TPayload> | Post<TRes, TPayload, TParam> {
  if (typeof path === "string")
    return {
      post: async () =>
        await serverFetch<TPayload, TRes>(path, { method: "POST", payload }),
    };

  return {
    post: async (params: TParam) =>
      await serverFetch<TPayload, TRes>(path(params), {
        method: "POST",
        payload,
      }),
  };
}

function getPost<TRes, TPayload>(
  path: string
): DirectGet<TRes> & DirectPost<TRes, TPayload>;

function getPost<TRes, TPayload, TParam>(
  path: (t: TParam) => string
): Get<TRes, TParam> & Post<TRes, TPayload, TParam>;

function getPost<TRes, TPayload, TParam>(
  path: string | ((t: TParam) => string)
):
  | (DirectGet<TRes> & DirectPost<TRes, TPayload>)
  | (Get<TRes, TParam> & Post<TRes, TPayload, TParam>) {
  if (typeof path === "string") {
    return {
      get: async () => await serverFetch<unknown, TRes>(path),
      post: async (payload?: TPayload) =>
        await serverFetch<TPayload, TRes>(path, {
          method: "POST",
          payload,
        }),
    };
  } else {
    return {
      get: async (params: TParam) =>
        await serverFetch<unknown, TRes>(path(params)),
      post: async (params: TParam, payload?: TPayload) =>
        await serverFetch<TPayload, TRes>(path(params), {
          method: "POST",
          payload,
        }),
    };
  }
}

// type ApiRoute = {
//   path: string;
// };
// type ApiGet<TResponse> = {
//   get: (params?: string | number) => Promise<TResponse>;
// };
// type ApiPost<TPayload, TResponse> = {
//   post: (opt?: { payload?: TPayload; params?: string }) => Promise<TResponse>;
// };
//
// type Get<TRes> = ApiRoute & ApiGet<TRes>;
// type Post<TReq, TRes> = ApiRoute & ApiPost<TReq, TRes>;
// type GetPost<TReq, TRes> = ApiRoute & ApiGet<TRes> & ApiPost<TReq, TRes>;
//
// type Method = "GET" | "POST" | undefined;
// function route<TReq, TRes>(path: string): GetPost<TReq, TRes>;
// function route<TRes>(path: string, method: "GET"): Get<TRes>;
// function route<TReq, TRes>(path: string, method: "POST"): Post<TReq, TRes>;
// function route<TReq, TRes>(
//   path: string,
//   method?: Method
// ): Get<TRes> | Post<TReq, TRes> | GetPost<TReq, TRes> {
//   switch (method) {
//     case "GET":
//       return {
//         path,
//         get: async (params?: string | number) =>
//           await serverFetch<TReq, TRes>(path, undefined, params),
//       };
//     case "POST":
//       return {
//         path,
//         post: async (opt?: { payload?: TReq; params?: string }) =>
//           await serverFetch<TReq, TRes>(
//             path,
//             { payload: opt?.payload, method: "POST" },
//             opt?.params
//           ),
//       };
//     default:
//       return {
//         // no method provided, allow both post and fetch
//         path,
//         get: async (params?: string | number) =>
//           await serverFetch<TReq, TRes>(path, undefined, params),
//         post: async (opt?: { payload?: TReq; params?: string }) =>
//           await serverFetch<TReq, TRes>(
//             path,
//             { payload: opt?.payload, method: "POST" },
//             opt?.params
//           ),
//       };
//   }
// }

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
