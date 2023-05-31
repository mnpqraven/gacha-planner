"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/Tabs";
import { JadeEstimate } from "./components/JadeEstimate";
import EstimateGraph from "./components/EstimateGraph";

export default function Home() {
  const [rolls, setRolls] = useState(90);

  function updateAvailableRolls(amount: number) {
    setRolls(amount);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Tabs defaultValue="estimateForm" className="w-full p-4">
        <TabsList>
          <TabsTrigger value="estimateForm">Jade Estimation</TabsTrigger>
          <TabsTrigger value="estimateGraph">Roll Probability</TabsTrigger>
        </TabsList>
        <TabsContent value="estimateForm">
          <JadeEstimate />
        </TabsContent>
        <TabsContent value="estimateGraph">
          <EstimateGraph rolls={rolls} updateRolls={updateAvailableRolls} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
