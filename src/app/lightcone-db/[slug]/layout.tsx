interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <main className="container flex max-h-[calc(100vh-3rem)] flex-col px-2 pt-4 sm:px-8 md:flex-row [&>*]:max-h-[calc(100vh-4rem)]">
      {children}
    </main>
  );
}
