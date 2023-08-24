"use client";

import { useEffect, useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  defaultBanner,
  useBannerList,
} from "@/hooks/queries/useGachaBannerList";
import { ReactECharts } from "../components/ReactEcharts";
import { GachaForm } from "./GachaForm";
import { defaultGachaQuery } from "./types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import STORAGE from "@/server/storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import equal from "fast-deep-equal/react";
import { rpc } from "@/server/typedEndpoints";
import { ProbabilityRateService } from "@grpc/probabilityrate_connect";
import { PlainMessage } from "@bufbuild/protobuf";
import { BannerType, ProbabilityRatePayload } from "@grpc/probabilityrate_pb";
import { schema } from "./schema";
import { chartOptions } from "./chartOptions";
import { useCacheValidate } from "@/hooks/useCacheValidate";

type FormSchema = PlainMessage<ProbabilityRatePayload>;

export default function GachaGraph() {
  const { theme } = useTheme();

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultGachaQuery,
  });
  const eidolonSubscriber = form.watch("currentEidolon");
  const bannerSubscriber = form.watch("banner");

  const { bannerList } = useBannerList();
  const selectedBanner =
    bannerList.find((e) => e.bannerType == BannerType[bannerSubscriber]) ??
    defaultBanner;

  const [storagedForm, setStoragedForm] = useLocalStorage<FormSchema>(
    STORAGE.gachaForm,
    defaultGachaQuery
  );

  const { data } = useQuery({
    queryKey: ["probabilityRate", storagedForm],
    queryFn: async () =>
      await rpc(ProbabilityRateService).post(storagedForm as FormSchema),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (storagedForm) {
      form.reset(storagedForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storagedForm]);

  useCacheValidate({
    schema,
    schemaData: storagedForm,
    onReload: () => {
      setStoragedForm(defaultGachaQuery);
      form.reset(defaultGachaQuery);
    },
  });

  // this is getting triggered every re-render
  const chartOption = useMemo(
    () =>
      chartOptions({
        data: data ?? { data: [], rollBudget: 0 },
        currentEidolon: eidolonSubscriber,
        selectedBanner,
        theme,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, selectedBanner, theme]
  );

  function updateQuery(payload: FormSchema) {
    if (!equal(payload, defaultGachaQuery) && !equal(storagedForm, payload)) {
      setStoragedForm(payload);
    }
  }

  return (
    <>
      <div className="py-4">
        <GachaForm
          updateQuery={updateQuery}
          selectedBanner={selectedBanner}
          form={form}
        />
      </div>
      {!!data && data.rollBudget > 0 && (
        <ReactECharts
          option={chartOption}
          style={{ height: "700px" }}
          settings={{ replaceMerge: "series", notMerge: true }}
        />
      )}
    </>
  );
}
