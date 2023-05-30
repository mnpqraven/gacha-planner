"use client";
import { ENDPOINT } from "@/server/endpoints";
import { workerFetch } from "@/server/fetchHelper";
import { useQuery } from "@tanstack/react-query";
import { ReactECharts } from "./components/ReactEcharts";
import { EChartsOption } from "echarts";
import { ChangeEvent, useState } from "react";
import { JadeEstimate } from "./components/JadeEstimate";

type ProbabilityRateResponse = {
  rolls: number;
  rates: DistributedRate[];
};
type DistributedRate = {
  draw_number: number;
  percent: number;
};
type ProbabilityRatePayload = {
  rolls: number;
  nextGuaranteed: boolean;
  simulateResult: boolean;
};
export default function Home() {
  const [rolls, setRolls] = useState(90);
  const [nextGuaranteed, setNextGuaranteed] = useState(false);
  const payload: ProbabilityRatePayload = {
    rolls,
    nextGuaranteed,
    simulateResult: false,
  };

  const { data: probabilityRate } = useQuery({
    queryKey: [ENDPOINT.probabilityRate, rolls],
    queryFn: async () =>
      await workerFetch<ProbabilityRatePayload, ProbabilityRateResponse>(
        ENDPOINT.probabilityRate,
        { payload, method: "POST" }
      ),
  });

  // if (isLoading || isError) return <p>loading</p>;

  const chartOptions: EChartsOption = {
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: probabilityRate?.rates.map((e) => e.draw_number),
    },
    yAxis: {
      axisLabel: {
        formatter: (params: string) => `${params} %`,
      },
    },
    series: [
      {
        name: "E0",
        type: "line",
        smooth: true,
        lineStyle: { width: 0 },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgb(255, 191, 0)",
              },
              {
                offset: 1,
                color: "rgb(224, 62, 76)",
              },
            ],
          },
        },
        emphasis: {
          focus: "series",
        },
        data: probabilityRate?.rates.map((e) =>
          Number(e.percent * 100).toFixed(2)
        ),
      },
    ],
    color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
          formatter: ({ value, axisDimension }) => {
            if (axisDimension == "x") return `Roll ${value}`;
            else return `${Number(value).toFixed(2)} %`;
          },
        },
      },
      valueFormatter: (value) => `${value} %`,
    },
  };

  function updateRolls(e: ChangeEvent<HTMLInputElement>) {
    setRolls(Number(e.target.value));
  }

  function updateAvailableRolls(amount: number) {
    setRolls(amount);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <JadeEstimate updateAvailableRoles={updateAvailableRolls} />
      <label>
        Next Guaranteed{" "}
        <input
          type="checkbox"
          onClick={(e) => setNextGuaranteed(e.currentTarget.checked)}
        />
      </label>
      <input
        type="number"
        onChange={updateRolls}
        defaultValue={rolls}
        style={{ color: "black" }}
      />
      <ReactECharts option={chartOptions} style={{ height: "700px" }} />
    </main>
  );
}
