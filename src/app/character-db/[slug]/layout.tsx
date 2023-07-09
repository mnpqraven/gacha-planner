import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <main className={"container grid grid-cols-1 px-2 pt-4 lg:grid-cols-2"}>
      {children}
    </main>
  );
}
