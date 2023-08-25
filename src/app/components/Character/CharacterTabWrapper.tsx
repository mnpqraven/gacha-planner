import { SkillOverview } from "./SkillOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { TraceTable } from "./TraceTable";
import { EidolonTable } from "./EidolonTable";
import { useQueryClient } from "@tanstack/react-query";
import API from "@/server/typedEndpoints";
import { useCharacterMetadata } from "@/hooks/queries/useCharacterMetadata";
import { useCharacterSkill } from "@/hooks/queries/useCharacterSkill";

type Props = {
  characterId: number;
};
const CharacterTabWrapper = ({ characterId }: Props) => {
  const { character } = useCharacterMetadata(characterId);
  const { data: skills } = useCharacterSkill(characterId);

  const client = useQueryClient();
  client.prefetchQuery({
    queryKey: ["properties"],
    queryFn: async () => await API.properties.get(),
  });

  if (!character || !skills) return null;

  const { avatar_base_type, spneed: maxEnergy } = character;

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
            // skills={skills.list}
            characterId={characterId}
            // maxEnergy={maxEnergy}
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
