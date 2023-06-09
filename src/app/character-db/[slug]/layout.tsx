interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <main className="grid grid-cols-1 overflow-hidden px-2 pt-4 lg:grid-cols-2">
      {children}
    </main>
  );
}
