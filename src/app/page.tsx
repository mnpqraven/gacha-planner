"use client";

import * as z from "zod";
import { useState } from "react";
import ENDPOINT from "@/server/endpoints";
import JadeEstimateForm from "./components/JadeEstimateForm";
import JadeRewardTable from "./components/JadeRewardTable";
import { placeholderTableData } from "./components/tableData";

export default function Home() {
  const [tableData, setTableData] =
    useState<z.infer<typeof ENDPOINT.jadeEstimate.response>>(
      placeholderTableData
    );

  function updateTableData(to: z.infer<typeof ENDPOINT.jadeEstimate.response>) {
    setTableData(to);
  }

  return (
    <main className="mt-4 flex w-screen flex-col items-center gap-4 md:flex-row md:items-start md:justify-evenly">
      <div className="w-11/12 md:w-[47%]">
        <JadeEstimateForm updateTable={updateTableData} />
      </div>
      <div className="w-11/12 md:w-[47%]">
        <JadeRewardTable data={tableData} />
      </div>
    </main>
  );
}
