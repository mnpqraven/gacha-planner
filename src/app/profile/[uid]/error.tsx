"use client";

import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";

export default function Error({ error }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <main className="mt-4 flex flex-col items-center justify-center gap-4 text-center">
      <h2>Something went wrong!</h2>
      <span>{error.message}</span>
      <Button className="w-fit" onClick={() => router.push("/profile")}>
        Go back
      </Button>
    </main>
  );
}
