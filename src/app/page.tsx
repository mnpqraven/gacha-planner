"use client";

import * as z from "zod";
import { useState } from "react";
import ENDPOINT from "@/server/endpoints";
import EstimateGraph from "./components/EstimateGraph";
import JadeEstimateForm from "./components/JadeEstimateForm";
import JadeRewardTable from "./components/JadeRewardTable";
import { placeholderTableData } from "./components/tableData";

export default function Home() {
  const [rolls, setRolls] = useState<number | undefined>(undefined);

  function updateAvailableRolls(amount: number) {
    setRolls(amount);
  }

  const [tableData, setTableData] =
    useState<z.infer<typeof ENDPOINT.jadeEstimate.response>>(
      placeholderTableData
    );

  function updateTableData(to: z.infer<typeof ENDPOINT.jadeEstimate.response>) {
    setTableData(to);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex w-screen gap-4 mt-4 justify-evenly">
        <div className="w-2/5">
          <JadeEstimateForm updateTable={updateTableData} />
        </div>
        <div className="w-2/5">
          <JadeRewardTable data={tableData} />
        </div>
      </div>
      <EstimateGraph rolls={rolls} updateRolls={updateAvailableRolls} />
    </main>
  );
}
