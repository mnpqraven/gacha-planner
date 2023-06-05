import { EChartsOption, SeriesOption } from "echarts";
import { ReactECharts } from "./ReactEcharts";
import { workerFetch } from "@/server/fetchHelper";
import { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ENDPOINT from "@/server/endpoints";
import { Input } from "./ui/Input";
import { Switch } from "./ui/Switch";
import { Label } from "./ui/Label";
import { Separator } from "./ui/Separator";
import * as z from "zod";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

type Props = {
  rolls: number | undefined;
  updateRolls: (to: number) => void;
};
const EstimateGraph = ({ rolls, updateRolls }: Props) => {
  const [nextGuaranteed, setNextGuaranteed] = useState(false);
  const [lastSSR, setLastSSR] = useState(0);
  const [currentEidolon, setCurrentEidolon] = useState(-1);
  const { theme } = useTheme();

  const payload: z.infer<(typeof ENDPOINT)["probabilityRate"]["payload"]> = {
    pulls: rolls ?? 0,
    nextGuaranteed,
    banner: "SSR",
    currentEidolon,
    enpitomizedPity: null,
    pity: lastSSR,
  };
  const { data } = useQuery({
    queryKey: [ENDPOINT.probabilityRate, payload],
    queryFn: async () =>
      await workerFetch(ENDPOINT.probabilityRate, {
        payload,
        method: "POST",
      }),
  });

  const probabilityRate: NonNullable<typeof data>["data"] = data
    ? structuredClone(data).data.map((eidolonsByPull) => {
        // DOGSHIT LANGUAGE AND ITS SHALLOW CLONING
        const newEidsByPull = structuredClone(eidolonsByPull);
        // appends eidolon pull if there's less than 7 entries
        Array.from(Array(7).keys()).forEach((eidolonNumber) => {
          const find = newEidsByPull.find((e) => e.eidolon == eidolonNumber);
          if (!find) newEidsByPull.push({ eidolon: eidolonNumber, rate: 0 });
        });

        // transform separate rate of each eidolon into accumulated rate for
        // lower eidolons
        newEidsByPull.forEach((cell) => {
          // gets cells with higher ei count
          const higherEidCells = eidolonsByPull.filter(
            (e) => e.eidolon > cell.eidolon
          );
          // append to current cell its rate sum
          cell.rate += higherEidCells
            .map((e) => e.rate)
            .reduce((a, b) => a + b, 0);
          // ceiling
          if (cell.rate > 1) cell.rate = 1;
          if (cell.rate < 0) cell.rate = 0;
        });
        return newEidsByPull;
      })
    : [];

  function updateCurrentEidolon(value: string) {
    setCurrentEidolon(Number(value));
  }

  function onChangeRolls(e: ChangeEvent<HTMLInputElement>) {
    const num = Number(e.target.value);
    if (num >= 0) updateRolls(num);
  }

  function updateLastSSR(e: ChangeEvent<HTMLInputElement>) {
    const num = Number(e.target.value);
    if (num >= 0 && num < 90) setLastSSR(num);
  }

  const chartOptions: EChartsOption = {
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data?.data.map((_, index) => index),
    },
    yAxis: {
      axisLabel: {
        formatter: (params: string) => `${params} %`,
      },
      max: 100,
    },
    legend: {
      show: true,
      textStyle: { color: theme === "light" ? "black" : "white" },
    },
    series: Array.from(range(currentEidolon + 1, 6, 1)).map((eidolon) =>
      createChartSeries(eidolon, probabilityRate)
    ),
    color: [
      "#caffbf",
      "#9bf6ff",
      "#a0c4ff",
      "#bdb2ff",
      "#ffc6ff",
      "#fdffb6",
      // "#ffd6a5",
      "#ffadad"
    ],
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
      <div className="flex gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="rolls">Total Rolls</Label>
          <Input
            id="rolls"
            type="number"
            onChange={onChangeRolls}
            value={rolls ?? 0}
          />
          <Label htmlFor="lastSSR">Rolls since last SSR</Label>
          <Input
            id="lastSSR"
            type="number"
            onChange={updateLastSSR}
            value={lastSSR}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="currentEidolon">Current Eidolon</Label>
          <Select onValueChange={updateCurrentEidolon} defaultValue="-1">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="-1">Not Owned</SelectItem>
              {Array.from(range(0, 5, 1)).map((e) => (
                <SelectItem value={String(e)} key={e}>
                  Eidolon {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label htmlFor="isGuaranteed">Next Guaranteed</Label>
          <div className="flex grow items-center">
            <Switch onCheckedChange={setNextGuaranteed} id="isGuaranteed" />
          </div>
        </div>
      </div>
      <ReactECharts
        option={chartOptions}
        style={{ height: "700px" }}
        settings={{ replaceMerge: ["series"] }}
      />
    </>
  );
};

function createChartSeries(
  eidolon: number,
  queryData: { eidolon: number; rate: number }[][]
): SeriesOption {
  const data = queryData.map((eidsInRoll) => {
    const currentEid = eidsInRoll.find((e) => e.eidolon == eidolon)?.rate ?? 0;
    return Number(currentEid * 100).toFixed(2);
  });
  const opt: EChartsOption["series"] = {
    name: `E${eidolon}`,
    type: "line",
    smooth: true,
    showSymbol: false,
    areaStyle: {
      opacity: 0.5,
    },
    emphasis: {
      disabled: true,
    },
    data: data,
  };
  return opt;
}

function* range(start: number, end: number, step: number) {
  while (start <= end) {
    yield start;
    start += step;
  }
}
export default EstimateGraph;
