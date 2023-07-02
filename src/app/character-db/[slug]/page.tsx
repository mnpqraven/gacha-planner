import { SkillOverview } from "@/app/components/Character/SkillOverview";
import { TraceTable } from "@/app/components/Character/TraceTable";
import { AspectRatio } from "@/app/components/ui/AspectRatio";
import API from "@/server/typedEndpoints";
import Image from "next/image";

interface Props {
  params: { slug: string };
}

export default async function Character({ params }: Props) {
  const { slug: characterId } = params;
  const character = await API.mhyCharacter.fetch({
    params: characterId,
  });
  const { list: skills } = await API.mhySkill.fetch({ params: characterId });

  return (
    <>
      <div className="aspect-square">
        <Image
          src={portraitUrl(characterId)}
          width={2048}
          height={2048}
          className="place-self-start object-contain sm:w-[40vw]"
          alt={character.name}
        />
      </div>

      <div className="flex grow flex-col items-center">
        <SkillOverview
          skills={skills}
          characterId={characterId as unknown as number}
          maxEnergy={character.max_sp}
        />

        <TraceTable
          characterId={characterId as unknown as number}
          wrapperSize={480}
          path={character.path}
          maxEnergy={character.max_sp}
        />
      </div>
    </>
  );
}

function portraitUrl(charId: number | string): string {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/image/character_portrait/${charId}.png`;
}

function pathUrl(path: string) {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${path}.png`;
}
