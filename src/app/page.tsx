"use client";
import { useQuery } from "@tanstack/react-query";
import { env } from "process";

export default function Home() {
  // INFO: infinite render
  // const { data } = useQuery({
  //   queryKey: ["dev"],
  //   queryFn: async () => await fetch(`${env.WORKER_API}/honkai/honkaijade`),
  // });
  // console.warn(data?.text());

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* {data?.text()} */}
    </main>
  );
}
