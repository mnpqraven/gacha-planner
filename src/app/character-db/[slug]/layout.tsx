interface Props {
  children: React.ReactNode;
}
export default function CharacterLayout({ children }: Props) {
  return <main className="container pt-4">{children}</main>;
}
