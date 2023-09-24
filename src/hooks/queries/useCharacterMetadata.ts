import { AvatarConfig } from "@/bindings/AvatarConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<AvatarConfig>,
  "queryKey" | "queryFn" | "enabled"
>;

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
