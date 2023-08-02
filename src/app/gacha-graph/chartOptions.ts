import { Banner } from "@/hooks/queries/useGachaBannerList";
import { range } from "@/lib/utils";
import { PlainMessage } from "@bufbuild/protobuf";
import { ProbabilityRateResponse } from "@grpc/probabilityrate_pb";
import { EChartsOption, SeriesOption } from "echarts";

type ChartData = PlainMessage<ProbabilityRateResponse>;

export function chartOptions({
  data,
  currentEidolon,
  theme,
  selectedBanner,
}: {
  data: ChartData;
  currentEidolon: number;
  theme: string | undefined;
  selectedBanner: Banner;
}): EChartsOption {
  if (!data) console.warn("SHOULD NEVER SEE THIS");
  return {
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.data?.map((_, index) => index),
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
      range(currentEidolon + 1, selectedBanner.maxConst, 1)
    ).map((eidolon) =>
      createChartSeries(selectedBanner.constShorthand, eidolon, data)
    ),
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
}

function createChartSeries(
  constShorthand: string,
  eidolon: number,
  queryData: ChartData
): SeriesOption {
  const data = queryData.data.map((eidsInRoll) => {
    const currentEid =
      eidsInRoll.index.find((e) => e.eidolon == eidolon)?.rate ?? 0;
    return Number(currentEid * 100).toFixed(2);
  });
  const opt: EChartsOption["series"] = {
    name: `${constShorthand}${eidolon}`,
    type: "line",
    showSymbol: false,
    areaStyle: { opacity: 0.2 + eidolon * 0.1 },
    emphasis: { disabled: true },
    data,
  };
  return opt;
}