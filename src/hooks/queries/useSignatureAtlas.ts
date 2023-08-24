import { rpc } from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { SignatureAtlasService } from "@grpc/atlas_connect";
import { SignatureReturn, SignatureReturns } from "@grpc/atlas_pb";

type Options = Omit<
  UseQueryOptions<SignatureReturns, unknown, SignatureReturn[]>,
  "queryKey" | "queryFn" | "select"
>;

export const optionsSignatureAtlas = () =>
  queryOptions<SignatureReturns, unknown, SignatureReturn[]>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["signature_atlas"],
    queryFn: async () => await rpc(SignatureAtlasService).list({}),
    select: (data) => data.list,
  });

export function useSignatureAtlas(opt: Options = {}) {
  const query = useQuery({
    ...optionsSignatureAtlas(),
    ...opt,
  });
  return query;
}

export function useSuspendedSignatureAtlas(opt: Options = {}) {
  const query = useSuspenseQuery({
    ...optionsSignatureAtlas(),
    ...opt,
  });
  return query;
}
