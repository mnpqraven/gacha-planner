import { EChartsOption } from "echarts";
import { ReactECharts } from "./ReactEcharts";
import { workerFetch } from "@/server/fetchHelper";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINT } from "@/server/endpoints";
import { Input } from "./ui/Input";
import { Switch } from "./ui/Switch";
import { Label } from "./ui/Label";
import { Separator } from "./ui/separator";

type Props = {
  rolls: number | undefined;
  updateRolls: (to: number) => void;
};
const EstimateGraph = ({ rolls, updateRolls }: Props) => {
  const [nextGuaranteed, setNextGuaranteed] = useState(false);

  const { data: probabilityRate } = useQuery({
    queryKey: [ENDPOINT.probabilityRate, rolls],
    queryFn: async () =>
      await workerFetch(ENDPOINT.probabilityRate, {
        payload: {
          rolls: rolls ?? 0,
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
      <Separator className="my-4" />
      <div className="flex gap-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="rolls">Total Rolls</Label>
          <Input
            id="rolls"
            type="number"
            onChange={(e) => updateRolls(Number(e.target.value))}
            defaultValue={rolls ?? 0}
            style={{ color: "black" }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="isGuaranteed">Next Guaranteed</Label>
          <div className="flex grow items-center">
            <Switch onCheckedChange={setNextGuaranteed} id="isGuaranteed" />
          </div>
        </div>
      </div>
      <ReactECharts option={chartOptions} style={{ height: "700px" }} />
    </>
  );
};
export default EstimateGraph;
