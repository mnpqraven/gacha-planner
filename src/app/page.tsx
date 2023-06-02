"use client";

import * as z from "zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { workerFetch } from "@/server/fetchHelper";
import { ENDPOINT } from "@/server/endpoints";
import { jadeEstimateFormSchema } from "./components/schemas";
import EstimateGraph from "./components/EstimateGraph";
import JadeEstimateForm from "./components/JadeEstimateForm";
import JadeRewardTable from "./components/JadeRewardTable";

export default function Home() {
  const [rolls, setRolls] = useState<number | undefined>(undefined);

  function updateAvailableRolls(amount: number) {
    setRolls(amount);
  }

  const jadeEstimateQuery = useMutation({
    mutationFn: async (payload: z.infer<typeof jadeEstimateFormSchema>) =>
      await workerFetch(ENDPOINT.jadeEstimate, { payload, method: "POST" }),
    onSuccess: (data) => setRolls(data.rolls),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex gap-4 mt-4">
        <div className="">
          <JadeEstimateForm jadeEstimateMutate={jadeEstimateQuery.mutate} />
        </div>
        <div className="">
          <JadeRewardTable data={jadeEstimateQuery.data} />
        </div>
      </div>
      <EstimateGraph rolls={rolls} updateRolls={updateAvailableRolls} />
    </main>
  );
}
