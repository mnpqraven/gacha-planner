import { Character } from "@/bindings/PatchBanner";
import { SkillOverview } from "./SkillOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { TraceTable } from "./TraceTable";
import { EidolonTable } from "./EidolonTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { typedFetch } from "@/server/fetchHelper";
import ENDPOINT from "@/server/endpoints";
import { DbAttributeProperty } from "@/bindings/DbAttributeProperty";
import API from "@/server/typedEndpoints";

type Props = {
  characterId: number;
};
const CharacterTabWrapper = ({ characterId }: Props) => {
  const { data } = useQuery({
    queryKey: ["character", characterId],
    queryFn: async () => await API.character.get(characterId),
  });

  const { data: skills } = useQuery({
    queryKey: ["skillsByCharId", characterId],
    queryFn: async () => await API.skillsByCharId.get(characterId),
  });

  const client = useQueryClient();
  client.prefetchQuery({
    queryKey: ["attribute_property"],
    queryFn: async () =>
      await typedFetch<undefined, { list: DbAttributeProperty[] }>(
        ENDPOINT.mhyAttributeProperty
      ),
  });

  if (!data || !skills) return null;

  const { avatar_base_type, spneed: maxEnergy } = data;

  return (
    <>
      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="eidolons">Eidolons</TabsTrigger>
          <TabsTrigger value="traces">Traces</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <SkillOverview
            skills={skills.list}
            characterId={characterId}
            maxEnergy={maxEnergy}
          />
        </TabsContent>

        <TabsContent value="eidolons">
          <EidolonTable characterId={characterId} />
        </TabsContent>

        <TabsContent value="traces" className="h-[30rem]">
          <div className="flex justify-center">
            <TraceTable
              characterId={characterId}
              path={avatar_base_type}
              maxEnergy={maxEnergy}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export { CharacterTabWrapper };
