interface Props {
  params: { slug: string };
}

export default function Page({ params }: Props) {
  const { slug: characterId } = params;

  return <div>id: {characterId}</div>;
}
