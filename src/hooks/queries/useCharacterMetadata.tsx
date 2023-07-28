import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export function useCharacterMetadata(characterId: number | undefined) {
  const query = useQuery({
    queryKey: ["character", characterId],
    queryFn: async () => await API.character.get(characterId),
    enabled: !!characterId
  });

  return { character: query.data };
}
