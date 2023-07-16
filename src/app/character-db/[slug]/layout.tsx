import Image from "next/image";

interface Props {
  children: React.ReactNode;
  params: { slug: string };
}
export default function Layout({ children, params }: Props) {
  const characterId = parseInt(params.slug);

  return (
    <main className="grid grid-cols-1 overflow-hidden px-2 pt-4 lg:grid-cols-2">
      <div className="aspect-square">
        <Image
          src={portraitUrl(characterId)}
          width={2048}
          height={2048}
          className="place-self-start object-contain"
          alt={params.slug}
        />
      </div>
      {children}
    </main>
  );
}

function portraitUrl(charId: number | string): string {
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/image/character_portrait/${charId}.png`;
}
