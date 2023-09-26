import { AvatarConfig } from "@/bindings/AvatarConfig";
import API from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";

export const optionCharacterMetadata = (charId: number | undefined) =>
  queryOptions<AvatarConfig>({
    queryKey: ["character", charId],
    queryFn: async () => await API.character.get({ characterId: charId! }),
    enabled: !!charId,
  });

export function useCharacterMetadata(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionCharacterMetadata(characterId),
    ...opt,
  });

  return query;
}

export function useSuspendedCharacterMetadata(
  characterId: number | undefined,
  opt: SuspendedOptions = {}
) {
  const query = useQuery({
    ...optionCharacterMetadata(characterId),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<AvatarConfig>,
  "queryKey" | "queryFn" | "enabled"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<AvatarConfig>,
  "queryKey" | "queryFn"
>;
