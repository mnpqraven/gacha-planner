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
import {
  Banner,
  defaultBanner,
  useBannerList,
} from "@/hooks/queries/useBannerList";

type Props = {
  rolls: number | undefined;
  updateRolls: (to: number) => void;
};
const EstimateGraph = ({ rolls, updateRolls }: Props) => {
  const [nextGuaranteed, setNextGuaranteed] = useState(false);
  const [lastSSR, setLastSSR] = useState(0);
  const [currentBanner, setCurrentBanner] = useState<Banner>(defaultBanner);
  const [currentEidolon, setCurrentEidolon] = useState(-1);
  const { theme } = useTheme();
  const { bannerList } = useBannerList();

  const payload: z.infer<(typeof ENDPOINT)["probabilityRate"]["payload"]> = {
    pulls: rolls ?? 0,
    nextGuaranteed,
    banner: currentBanner.bannerType,
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

  function updateCurrentEidolon(value: string) {
    setCurrentEidolon(Number(value));
  }

  function onChangeBanner(bannerType: string) {
    const find = bannerList.find(
      (z) => z.bannerType == (bannerType as typeof z.bannerType)
    );
    if (find) setCurrentBanner(find);
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
    series: Array.from(
      range(currentEidolon + 1, currentBanner.maxConst, 1)
    ).map((eidolon) => createChartSeries(eidolon, data)),
    color: [
      "#caffbf",
      "#9bf6ff",
      "#a0c4ff",
      "#bdb2ff",
      "#ffc6ff",
      "#fdffb6",
      // "#ffd6a5",
      "#ffadad",
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
          <Label>Banner</Label>
          <Select defaultValue="SSR" onValueChange={onChangeBanner}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {bannerList.map(({ bannerName, bannerType }, index) => (
                <SelectItem value={bannerType} key={index}>
                  {bannerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          <Label htmlFor="currentEidolon">
            Current {currentBanner.constPrefix}
          </Label>
          <Select onValueChange={updateCurrentEidolon} defaultValue="-1">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="-1">Not Owned</SelectItem>
              {Array.from(range(0, 5, 1)).map((e) => (
                <SelectItem value={String(e)} key={e}>
                  {currentBanner.constPrefix} {e}
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
  // queryData: { eidolon: number; rate: number }[][]
  queryData:
    | z.infer<(typeof ENDPOINT)["probabilityRate"]["response"]>
    | undefined
): SeriesOption {
  const data = queryData?.data.map((eidsInRoll) => {
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
    data,
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
