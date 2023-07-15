import { SimpleSkill } from "@/bindings/PatchBanner";
import { serverFetch } from "./serverFetch";
import { DbCharacter } from "@/bindings/DbCharacter";
import { LightCone } from "@/bindings/LightConeFull";
import { SignatureAtlas } from "@/bindings/SignatureAtlas";
import { List } from "@/lib/generics";
import { AvatarConfig } from "@/bindings/AvatarConfig";
import { SkillTreeConfig } from "@/bindings/SkillTreeConfig";
import { AvatarSkillConfig } from "@/bindings/AvatarSkillConfig";

const API = {
  mhyCharacterList: route<{ list: DbCharacter[] }>(
    "/honkai/mhy/character",
    "GET"
  ),
  mhyCharacter: route<DbCharacter>("/honkai/mhy/character", "GET"),
  mhySkill: route<List<SimpleSkill>>("/honkai/mhy/skill", "GET"),
  mhyBigTrace: route<List<SimpleSkill>>("/honkai/mhy/big_trace", "GET"),
  lightConeList: route<List<LightCone>>("/honkai/light_cone", "GET"),
  character: route<AvatarConfig>("/honkai/avatar", "GET"),
  characters: route<List<number>, List<AvatarConfig>>("/honkai/avatar"),
  lightCone: route<List<number>, List<LightCone>>("/honkai/light_cone"),
  signatureAtlas: route<List<SignatureAtlas>>("/honkai/signature_atlas", "GET"),
  trace: route<List<SkillTreeConfig>>("/honkai/trace", "GET"),
  skillsByCharId: route<List<AvatarSkillConfig>>("/honkai/skill", "GET"),
  skills: route<List<number>, List<AvatarSkillConfig>>("/honkai/skills", "POST"),
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

export default API;
