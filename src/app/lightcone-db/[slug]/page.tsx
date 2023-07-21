import API from "@/server/typedEndpoints";
import { Portrait } from "./Portrait";
import { Content } from "./Content";
import { LightConeRanking } from "./LightConeRanking";

interface Props {
  params: { slug: string };
}

export default async function LightConePage({ params }: Props) {
  const { slug: lightConeId } = params;
  const callLc = API.lightConeMetadata.get(lightConeId);
  const callLcSkill = API.lightConeSkill.get(lightConeId);

  console.log(API.lightConeSkill.path);
  const [lc, lcSkill] = await Promise.all([callLc, callLcSkill]);

  return (
    <>
      <div className="aspect-[5/7] p-12 md:max-w-[50%]">
        <Portrait data={lc} />
      </div>
      <div className="flex flex-col md:max-w-[50%] gap-4">
        <Content data={lc} skill={lcSkill} />
        <LightConeRanking id={parseInt(lightConeId)} />
      </div>
    </>
  );
}
