import API from "@/server/typedEndpoints";
import { Portrait } from "./Portrait";
import { Content } from "./Content";
import { LightConeRanking } from "./LightConeRanking";

interface Props {
  params: { slug: string };
}

export default async function LightConePage({ params }: Props) {
  const lcId = parseInt(params.slug);
  const callLc = API.lightConeMetadata.get({ lcId });
  const callLcSkill = API.lightConeSkill.get({ lcId });

  const [lc, lcSkill] = await Promise.all([callLc, callLcSkill]);

  return (
    <>
      <div className="h-fit p-12 md:max-w-[50%]">
        <Portrait data={lc} />
      </div>
      <div className="flex flex-col gap-4 md:max-w-[50%]">
        <Content data={lc} skill={lcSkill} />
        <LightConeRanking id={lcId} />
      </div>
    </>
  );
}
