"use client";

import { EChartsOption } from "echarts";
import { ReactECharts } from "./ReactEcharts";
import { workerFetch } from "@/server/fetchHelper";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINT } from "@/server/endpoints";

type Props = {
  rolls: number;
  updateRolls: (to: number) => void;
};
const EstimateGraph = ({ rolls, updateRolls }: Props) => {
  const [nextGuaranteed, setNextGuaranteed] = useState(false);

  const { data: probabilityRate } = useQuery({
    queryKey: [ENDPOINT.probabilityRate, rolls],
    // FIX: server side code
    queryFn: async () =>
      await workerFetch(ENDPOINT.probabilityRate, {
        payload: {
          rolls,
          nextGuaranteed,
          simulateResult: false,
        },
        method: "POST",
      }),
  });

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
  return (
    <>
      <label>
        Next Guaranteed{" "}
        <input
          type="checkbox"
          onClick={(e) => setNextGuaranteed(e.currentTarget.checked)}
        />
      </label>
      <input
        type="number"
        onChange={(e) => updateRolls(Number(e.target.value))}
        defaultValue={rolls}
        style={{ color: "black" }}
      />
      <ReactECharts option={chartOptions} style={{ height: "700px" }} />
    </>
  );
};
export default EstimateGraph;
