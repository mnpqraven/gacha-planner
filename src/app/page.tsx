"use client";

import * as z from "zod";
import { useState } from "react";
import ENDPOINT from "@/server/endpoints";
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
    <main className="flex flex-col items-center justify-between">
      <div className="flex flex-col md:flex-row w-screen gap-4 mt-4 justify-evenly items-center">
        <div className="w-11/12 md:w-2/5 ">
          <JadeEstimateForm updateTable={updateTableData} />
        </div>
        <div className="w-11/12 md:w-2/5 ">
          <JadeRewardTable data={tableData} />
        </div>
      </div>
    </main>
  );
}
