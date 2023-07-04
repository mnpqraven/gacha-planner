import API from "@/server/typedEndpoints";

interface Props {
  params: { slug: string };
}

export default async function LightConePage({ params }: Props) {
  const { slug: lightConeId } = params;
  const lc = await API.lightCone.fetch({ params: lightConeId });
  return lc.metadata.equipment_name
}
