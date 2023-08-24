import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <main
      className={cn(
        "container flex flex-col px-2 pt-4 sm:px-8 md:flex-row",
        "max-h-[calc(100vh-3rem)]",
        "[&>*]:max-h-[calc(100vh-4rem)]"
      )}
    >
      {children}
    </main>
  );
}
