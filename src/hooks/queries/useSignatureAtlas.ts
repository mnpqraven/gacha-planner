import { rpc } from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { SignatureAtlasService } from "@grpc/atlas_connect";
import { SignatureReturn } from "@grpc/atlas_pb";
import { PlainMessage } from "@bufbuild/protobuf";

export const optionsSignatureAtlas = () =>
  queryOptions<
    PlainMessage<SignatureReturn>[],
    unknown,
    PlainMessage<SignatureReturn>[]
  >({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["signatures"],
    queryFn: async () =>
      await rpc(SignatureAtlasService)
        .list({})
        .then((data) =>
          data.list.map(
            (e) => JSON.parse(e.toJsonString()) as PlainMessage<SignatureReturn>
          )
        ),
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
  UseQueryOptions<
    PlainMessage<SignatureReturn>[],
    unknown,
    PlainMessage<SignatureReturn>[]
  >,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<
    PlainMessage<SignatureReturn>[],
    unknown,
    PlainMessage<SignatureReturn>[]
  >,
  "queryKey" | "queryFn" | "select"
>;
