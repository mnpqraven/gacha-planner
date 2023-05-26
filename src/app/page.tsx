"use client";
import { ENDPOINT } from "@/server/endpoints";
import { workerFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";

type ProbabilityRateResponse = {
  rolls: number;
  rates: DistributedRate[];
};
type DistributedRate = {
  draw_number: number;
  percent: number;
};
export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: [ENDPOINT.probabilityRate],
    queryFn: async () =>
      await workerFetch<ProbabilityRateResponse>(ENDPOINT.probabilityRate, {
        payload: { rolls: 100 },
        method: "POST",
      }),
  });

  if (isLoading || isError) return <p>loading</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <>api data: {data.rolls}</>
    </main>
  );
}
