import { SimpleSkill } from "@/bindings/PatchBanner";
import { serverFetch } from "./serverFetch";
import { DbCharacter } from "@/bindings/DbCharacter";

const API = {
  mhyCharacter: route<undefined, { list: DbCharacter[] }>(
    "/honkai/mhy/character"
  ),
  mhyBigTrace: route<undefined, { list: SimpleSkill[] }>(
    "/honkai/mhy/big_trace"
  ),
};

type ApiRoute<TPayload, TResponse> = {
  path: string;
  call: (opt?: { payload?: TPayload; params?: string }) => Promise<TResponse>;
};

function route<T, U>(path: string): ApiRoute<T, U> {
  return {
    path,
    call: async (opt?: { payload?: T; params?: string }) =>
      await serverFetch<T, U>(
        path,
        opt?.payload ? { payload: opt.payload, method: "POST" } : undefined,
        opt?.params
      ),
  };
}

export default API;
