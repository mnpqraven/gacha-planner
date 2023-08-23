import { AvatarSkillConfig } from "@/bindings/AvatarSkillConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<List<AvatarSkillConfig>, unknown, AvatarSkillConfig[]>,
  "enabled" | "inialData"
>;
export function useCharacterSkill(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    queryKey: ["skill", characterId],
    queryFn: async () => await API.skillsByCharId.get(characterId),
    initialData: { list: [] },
    enabled: !!characterId,
    select: (data) => data.list,
    ...opt,
  });

  return { skills: query.data };
}
