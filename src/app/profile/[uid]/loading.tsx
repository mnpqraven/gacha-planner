import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex h-[80vh] w-screen items-center justify-center">
      <Loader2 className="animate-spin" />
    </main>
  );
}
