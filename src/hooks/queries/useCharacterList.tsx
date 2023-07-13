import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export const useCharacterList = () => {
  const { data: characterList } = useQuery({
    queryKey: ["characterList"],
    queryFn: async () => {
      const { list } = await API.character.get();
      return list;
    },
    initialData: [],
  });
  return { characterList };
};
