import { SimpleSkill } from "@/bindings/PatchBanner";
import { SkillOverview } from "./SkillOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import Image from "next/image";
import { TraceTable } from "./TraceTable";
import { EidolonTable } from "./EidolonTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { typedFetch } from "@/server/fetchHelper";
import ENDPOINT from "@/server/endpoints";
import { DbCharacter } from "@/bindings/DbCharacter";
import { DbAttributeProperty } from "@/bindings/DbAttributeProperty";

type Props = {
  skills: SimpleSkill[];
  characterId: number;
};
const CharacterTabWrapper = ({ skills, characterId }: Props) => {
  const { data } = useQuery({
    queryKey: ["character", characterId],
    queryFn: async () =>
      await typedFetch<undefined, DbCharacter>(
        ENDPOINT.mhyCharacter,
        undefined,
        characterId
      ),
  });

  const client = useQueryClient();
  client.prefetchQuery({
    queryKey: ["attribute_property"],
    queryFn: async () =>
      await typedFetch<undefined, { list: DbAttributeProperty[] }>(
        ENDPOINT.mhyAttributeProperty
      ),
  });

  if (!data) return null;
  return (
    <>
      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="eidolons">Eidolons</TabsTrigger>
          <TabsTrigger value="traces">Traces</TabsTrigger>
        </TabsList>
        <TabsContent value="skills">
          <SkillOverview skills={skills} characterId={characterId} />
        </TabsContent>
        <TabsContent value="traces" className="h-[30rem]">
          <div className="absolute w-full h-full text-center before:inline-block before:align-middle before:h-full -z-50 -mx-6 pt-[72px] pb-6 top-0">
            <Image
              className="inline-block align-middle opacity-10"
              src={pathUrl(data.path)}
              alt={data.path}
              quality={100}
              width={384}
              height={384}
            />
          </div>
          <TraceTable characterId={characterId} path={data.path} />
        </TabsContent>
        <TabsContent value="eidolons">
          <EidolonTable characterId={characterId} />
        </TabsContent>
      </Tabs>
    </>
  );
};

function pathUrl(path: string) {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${path}.png`;
}

export { CharacterTabWrapper };
