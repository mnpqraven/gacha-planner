import { AvatarConfig } from "@/bindings/AvatarConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<
  UseQueryOptions<List<AvatarConfig>, unknown, AvatarConfig[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;
export const useCharacterList = (opt: Options = {}) => {
  const query = useQuery({
    queryKey: ["characterList"],
    queryFn: async () => await API.characterByIds.get(),
    initialData: { list: [] },
    select: (data) => data.list,
    ...opt,
  });
  return { characterList: query.data };
};
