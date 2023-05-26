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
  const query = useQuery({
    queryKey: [ENDPOINT.probabilityRate],
    queryFn: async () =>
      await workerFetch<ProbabilityRateResponse>(ENDPOINT.probabilityRate, {
        payload: { rolls: 100 },
        method: "POST",
      }),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {query.isLoading || query.isError ? (
        <>loading</>
      ) : (
        <>api data: {query.data.rolls}</>
      )}
    </main>
  );
}
