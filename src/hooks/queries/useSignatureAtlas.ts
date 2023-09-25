import { rpc } from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { SignatureAtlasService } from "@grpc/atlas_connect";
import { SignatureReturn, SignatureReturns } from "@grpc/atlas_pb";
import { PlainMessage } from "@bufbuild/protobuf";

export const optionsSignatureAtlas = () =>
  queryOptions<SignatureReturns, unknown, SignatureReturn[]>({
    queryKey: ["signatures"],
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

export function useSuspendedSignatureAtlas(opt: SuspendedOptions = {}) {
  const query = useSuspenseQuery({
    ...optionsSignatureAtlas(),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<SignatureReturns, unknown, SignatureReturn[]>,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<SignatureReturns, unknown, SignatureReturn[]>,
  "queryKey" | "queryFn" | "select"
>;
