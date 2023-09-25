import { SkillOverview } from "./SkillOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { TraceTable } from "./TraceTable";
import { EidolonTable } from "./EidolonTable";
import { useQueryClient } from "@tanstack/react-query";
import API from "@/server/typedEndpoints";

type Props = {
  characterId: number;
};
const CharacterTabWrapper = ({ characterId }: Props) => {
  const client = useQueryClient();
  client.prefetchQuery({
    queryKey: ["properties"],
    queryFn: async () => await API.properties.get(),
  });

  return (
    <>
      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="eidolons">Eidolons</TabsTrigger>
          <TabsTrigger value="traces">Traces</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <SkillOverview characterId={characterId} />
        </TabsContent>

        <TabsContent value="eidolons">
          <EidolonTable characterId={characterId} />
        </TabsContent>

        <TabsContent value="traces" className="h-[30rem]">
          <div className="flex justify-center">
            <TraceTable characterId={characterId} />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export { CharacterTabWrapper };
