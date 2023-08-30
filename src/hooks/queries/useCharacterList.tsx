import { AvatarConfig } from "@/bindings/AvatarConfig";
import { List } from "@/lib/generics";
import API from "@/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const optionsCharacterList = () =>
  queryOptions<List<AvatarConfig>, unknown, AvatarConfig[]>({
    queryKey: ["characterList"],
    queryFn: async () => await API.characterByIds.get(),
    initialData: { list: [] },
    select: (data) =>
      data.list.sort(
        (a, b) =>
          b.rarity - a.rarity ||
          a.avatar_name.localeCompare(b.avatar_name) ||
          a.avatar_votag.localeCompare(b.avatar_votag)
      ),
  });

export const useCharacterList = (opt: Options = {}) => {
  const query = useQuery({
    ...optionsCharacterList(),
    ...opt,
  });
  return { characterList: query.data };
};

export const useSuspendedCharacterList = (opt: SuspendedOptions = {}) => {
  const query = useSuspenseQuery({
    ...optionsCharacterList(),
    ...opt,
  });
  return { characterList: query.data };
};

type Options = Omit<
  UseQueryOptions<List<AvatarConfig>, unknown, AvatarConfig[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<List<AvatarConfig>, unknown, AvatarConfig[]>,
  "initialData" | "queryKey" | "queryFn" | "select"
>;
