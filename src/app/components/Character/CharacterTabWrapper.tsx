import { SimpleSkill } from "@/bindings/PatchBanner";
import { SkillOverview } from "./SkillOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import Image from "next/image";
import { TraceTable } from "./TraceTable";
import { anchorType } from "react-xarrows";

type Props = {
  skills: SimpleSkill[];
  characterId: number;
  path?: 'Nihility' | 'Destruction' | 'Hunt' | 'Preservation' | 'Harmony' | 'Abundance';
};
const CharacterTabWrapper = ({
  skills,
  characterId,
  path = "Nihility",
}: Props) => {
  return (
    <>
      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="traces">Traces</TabsTrigger>
          <TabsTrigger value="eidolons">Eidolons</TabsTrigger>
        </TabsList>
        <TabsContent value="skills">
          <SkillOverview skills={skills} characterId={characterId} />
        </TabsContent>
        <TabsContent value="traces" className="h-[30rem]">
          <div className="absolute w-full h-full text-center before:inline-block before:align-middle before:h-full -z-50 -mx-6 pt-[72px] pb-6 top-0">
            <Image
              className="inline-block align-middle opacity-10"
              src={pathUrl('Harmony')}
              alt={path}
              quality={100}
              width={384}
              height={384}
            />
          </div>
          <TraceTable characterId={1101} path={'Harmony'} />
        </TabsContent>
        <TabsContent value="eidolons"></TabsContent>
      </Tabs>
    </>
  );
};

function pathUrl(path: string) {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${path}.png`;
}

export { CharacterTabWrapper };
