import Image from "next/image";
import { env } from "process";

export default async function Home() {
  const backendData = await fetch([env.WORKER_API, "honkai/honkaijade"].join(""));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      from api: {backendData.text()}
    </main>
  );
}
