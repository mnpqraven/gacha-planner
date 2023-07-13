import API from "@/server/typedEndpoints";
import { Portrait } from "./Portrait";
import { Content } from "./Content";

interface Props {
  params: { slug: string };
}

export default async function LightConePage({ params }: Props) {
  const { slug: lightConeId } = params;
  const {
    list: [lc],
  } = await API.lightCone.get(lightConeId);

  return (
    <>
      <div className="aspect-[5/7] p-12 md:max-w-[50%]">
        <Portrait data={lc} />
      </div>
      <div className="md:max-w-[50%]">
        <Content data={lc} />
      </div>
    </>
  );
}
