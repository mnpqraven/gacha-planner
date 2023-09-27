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

export const optionsFeaturedLcList = () =>
  queryOptions<SignatureReturns, unknown, SignatureReturn[]>({
    queryKey: ["signatures"],
    queryFn: async () => await rpc(SignatureAtlasService).list({}),
    select: (data) => data.list,
  });

export const optionsFeaturedLc = (charId: number | undefined) =>
  queryOptions<SignatureReturn, unknown, SignatureReturn>({
    queryKey: ["signatures", charId],
    queryFn: async () => await rpc(SignatureAtlasService).byCharId({ charId }),
    enabled: !!charId,
  });

export function useFeaturedLcList(opt: Options = {}) {
  const query = useQuery({
    ...optionsFeaturedLcList(),
    ...opt,
  });
  return query;
}

export function useSuspendedFeaturedLcList(opt: SuspendedOptions = {}) {
  return useSuspenseQuery({
    ...optionsFeaturedLcList(),
    ...opt,
  });
}

export function useFeaturedLc(charId: number | undefined, opt: Option = {}) {
  return useQuery({
    ...optionsFeaturedLc(charId),
    ...opt,
  });
}

export function useSuspendedFeaturedLc(
  charId: number | undefined,
  opt: SuspendedOption = {}
) {
  return useSuspenseQuery({
    ...optionsFeaturedLc(charId),
    ...opt,
  });
}

type Option = Omit<
  UseQueryOptions<SignatureReturn, unknown, SignatureReturn>,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOption = Omit<
  UseSuspenseQueryOptions<SignatureReturn, unknown, SignatureReturn>,
  "queryKey" | "queryFn" | "select"
>;

type Options = Omit<
  UseQueryOptions<SignatureReturns, unknown, SignatureReturn[]>,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<SignatureReturns, unknown, SignatureReturn[]>,
  "queryKey" | "queryFn" | "select"
>;
