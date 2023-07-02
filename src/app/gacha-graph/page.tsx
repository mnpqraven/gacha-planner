"use client";

import { EChartsOption, SeriesOption } from "echarts";
import { workerFetch } from "@/server/fetchHelper";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ENDPOINT from "@/server/endpoints";
import * as z from "zod";
import { useTheme } from "next-themes";
import {
  Banner,
  defaultBanner,
  useBannerList,
} from "@/hooks/queries/useGachaBannerList";
import { ReactECharts } from "../components/ReactEcharts";
import { GachaForm } from "./GachaForm";
import { range } from "@/lib/utils";
import { defaultGachaQuery } from "./types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import STORAGE from "@/server/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import equal from "fast-deep-equal/react";

type FormSchema = z.infer<typeof ENDPOINT.probabilityRate.payload>;

export default function GachaGraph() {
  const { theme } = useTheme();
  const { bannerList } = useBannerList();
  const [selectedBanner, setSelectedBanner] = useState<Banner>(defaultBanner);

  const [payload, setPayload] = useState(defaultGachaQuery);
  const [savedFormData, setSavedFormData] = useLocalStorage<
    typeof payload | undefined
  >(STORAGE.gachaForm, undefined);

  const { data } = useQuery({
    queryKey: [ENDPOINT.probabilityRate, payload],
    queryFn: async () =>
      await workerFetch(ENDPOINT.probabilityRate, {
        payload,
        method: "POST",
      }),
  });
  // should only be undefined on mount
  const [definedData, setDefinedData] = useState<NonNullable<typeof data>>({
    data: [],
    roll_budget: 0,
  });

  const form = useForm<z.infer<typeof ENDPOINT.probabilityRate.payload>>({
    resolver: zodResolver(ENDPOINT.probabilityRate.payload),
    defaultValues: defaultGachaQuery,
  });

  // avoids mutating current on-screen chart data to undefined, not sure if
  // this is the best way
  useEffect(() => {
    if (data) setDefinedData(data);
  }, [data]);

  useEffect(() => {
    if (savedFormData) {
      form.reset(savedFormData);
      setPayload(savedFormData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedFormData]);
  const eidolonSubscriber = form.watch("currentEidolon");

  // this is getting triggered every re-render
  const chartOption = useMemo(
    () =>
      chartOptions({
        data: definedData,
        currentEidolon: eidolonSubscriber,
        selectedBanner,
        theme,
      }),
    [definedData, selectedBanner, theme]
  );

  function updateQuery(
    payload: z.infer<typeof ENDPOINT.probabilityRate.payload>
  ) {
    if (!equal(payload, defaultGachaQuery)) {
      if (!equal(savedFormData, payload)) setSavedFormData(payload);
    }
  }

  function updateSelectedBanner(bannerType: FormSchema["banner"]) {
    setSelectedBanner(bannerList.find((e) => e.bannerType === bannerType)!);
  }

  return (
    <main className="flex flex-col items-center">
      <div className="py-4">
        <GachaForm
          updateQuery={updateQuery}
          bannerOnChange={updateSelectedBanner}
          selectedBanner={selectedBanner}
          form={form}
        />
      </div>
      {definedData.roll_budget > 0 && (
        <ReactECharts
          option={chartOption}
          style={{ height: "700px" }}
          settings={{ replaceMerge: "series", notMerge: true }}
        />
      )}
    </main>
  );
}

type ChartData = z.infer<(typeof ENDPOINT)["probabilityRate"]["response"]>;
function chartOptions({
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
      data: data.data.map((_, index) => index),
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
    const currentEid = eidsInRoll.find((e) => e.eidolon == eidolon)?.rate ?? 0;
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
