import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export function useCharacterSkill(characterId: number | undefined) {
  const query = useQuery({
    queryKey: ["skill", characterId],
    queryFn: async () => await API.skillsByCharId.get(characterId),
    initialData: { list: [] },
    enabled: !!characterId,
  });
  return { skills: query.data?.list };
}
