interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <main className="flex max-h-[calc(100vh-3rem)] flex-col sm:px-8 px-2 pt-4 md:flex-row [&>*]:max-h-[calc(100vh-4rem)]">
      {children}
    </main>
  );
}
