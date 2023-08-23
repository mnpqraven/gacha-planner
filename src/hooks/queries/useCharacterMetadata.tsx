import { AvatarConfig } from "@/bindings/AvatarConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<UseQueryOptions<AvatarConfig>, "enabled">;
export function useCharacterMetadata(
  characterId: number | undefined,
  opt: Options
) {
  const query = useQuery({
    queryKey: ["character", characterId],
    queryFn: async () => await API.character.get(characterId),
    enabled: !!characterId,
    ...opt,
  });

  return { character: query.data };
}
