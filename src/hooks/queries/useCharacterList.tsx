import API from "@/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export const useCharacterList = () => {
  const query = useQuery({
    queryKey: ["characterList"],
    queryFn: async () => {
      const { list } = await API.characters.get();
      return list;
    },
    initialData: [],
  });
  return { characterList: query.data };
};
