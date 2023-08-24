"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  Banner,
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
import {
  ProbabilityRatePayload,
  ProbabilityRateResponse,
} from "@grpc/probabilityrate_pb";
import { schema } from "./schema";
import { chartOptions } from "./chartOptions";
import { useToast } from "../components/ui/Toast/useToast";
import { ToastAction } from "../components/ui/Toast/Toast";

type FormSchema = PlainMessage<ProbabilityRatePayload>;

export default function GachaGraph() {
  const { theme } = useTheme();
  const { bannerList } = useBannerList();
  const [selectedBanner, setSelectedBanner] = useState<Banner>(defaultBanner);

  const [payload, setPayload] = useState<FormSchema>(defaultGachaQuery);

  const [savedFormData, setSavedFormData] = useLocalStorage<FormSchema>(
    STORAGE.gachaForm,
    undefined
  );

  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const { data } = useQuery({
    queryKey: ["probabilityRate", payload],
    queryFn: async () => await rpc(ProbabilityRateService).post(payload),
  });

  const [definedData, setDefinedData] = useState<NonNullable<typeof data>>(
    new ProbabilityRateResponse({
      data: [],
      rollBudget: 0,
    })
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
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

  useEffect(() => {
    const { success } = schema.safeParse(savedFormData);
    if (!mounted && savedFormData && !success) {
      toast({
        title: "Outdated Local Cache",
        description:
          "The local cache seems to be outdated, this is usually due to an update to the website, if you are seeing this please click the following 'Reload' button.",
        action: (
          <ToastAction
            altText="Reload"
            onClick={() => {
              setSavedFormData(defaultGachaQuery);
              form.reset(defaultGachaQuery);
            }}
          >
            Reload
          </ToastAction>
        ),
      });
      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, savedFormData]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [definedData, selectedBanner, theme]
  );

  function updateQuery(payload: FormSchema) {
    if (!equal(payload, defaultGachaQuery) && !equal(savedFormData, payload)) {
      setSavedFormData(payload);
    }
  }

  function updateSelectedBanner(bannerType: "SSR" | "SR" | "LC") {
    const find = bannerList.find((e) => e.bannerType === bannerType);
    if (find) setSelectedBanner(find);
    else console.error("find is undefined, contact othi if you see this");
  }

  return (
    <>
      <div className="py-4">
        <GachaForm
          updateQuery={updateQuery}
          bannerOnChange={updateSelectedBanner}
          selectedBanner={selectedBanner}
          form={form}
        />
      </div>
      {definedData.rollBudget > 0 && (
        <ReactECharts
          option={chartOption}
          style={{ height: "700px" }}
          settings={{ replaceMerge: "series", notMerge: true }}
        />
      )}
    </>
  );
}
