import { AvatarConfig } from "@/bindings/AvatarConfig";
import API from "@/server/typedEndpoints";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

type Options = Omit<UseQueryOptions<AvatarConfig[]>, "initialData">;
export const useCharacterList = (opt: Options = {}) => {
  const query = useQuery({
    queryKey: ["characterList"],
    queryFn: async () => {
      const { list } = await API.characters.get();
      return list;
    },
    initialData: [],
    ...opt,
  });
  return { characterList: query.data };
};
