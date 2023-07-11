import { SimpleSkill } from "@/bindings/PatchBanner";
import { serverFetch } from "./serverFetch";
import { DbCharacter } from "@/bindings/DbCharacter";
import { LightCone } from "@/bindings/LightConeFull";
import { SignatureAtlas } from "@/bindings/SignatureAtlas";

const API = {
  mhyCharacterList: route<undefined, { list: DbCharacter[] }>(
    "/honkai/mhy/character"
  ),
  mhyCharacter: route<undefined, DbCharacter>("/honkai/mhy/character"),
  mhySkill: route<undefined, { list: SimpleSkill[] }>("/honkai/mhy/skill"),
  mhyBigTrace: route<undefined, { list: SimpleSkill[] }>(
    "/honkai/mhy/big_trace"
  ),
  lightConeList: route<undefined, { list: LightCone[] }>("/honkai/light_cone"),
  lightCone: route<undefined, LightCone>("/honkai/light_cone"),
  lightCones: route<{ ids: number[] }, { list: LightCone[] }>(
    "/honkai/light_cones"
  ),
  signatureAtlas: route<undefined, { list: SignatureAtlas[] }>(
    "/honkai/signature_atlas"
  ),
};

type ApiRoute<TPayload, TResponse> = {
  path: string;
  fetch: (opt?: { payload?: TPayload; params?: string }) => Promise<TResponse>;
};

function route<T, U>(path: string): ApiRoute<T, U> {
  return {
    path,
    fetch: async (opt?: { payload?: T; params?: string }) =>
      await serverFetch<T, U>(
        path,
        opt?.payload ? { payload: opt.payload, method: "POST" } : undefined,
        opt?.params
      ),
  };
}

export default API;
