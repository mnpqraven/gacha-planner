import { AvatarSkillConfig } from "@/bindings/AvatarSkillConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<List<AvatarSkillConfig>, unknown, AvatarSkillConfig[]>,
  "enabled" | "queryKey" | "queryFn" | "select" | "initialData"
>;
export function useCharacterSkill(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    queryKey: ["skill", characterId],
    queryFn: async () =>
      await API.skillsByCharId.get({ characterId: characterId! }),
    select: (data) => data.list,
    initialData: { list: [] },
    enabled: !!characterId,
    ...opt,
  });

  return query;
}
