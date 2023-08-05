"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { defaultValues } from "./JadeEstimateForm";
import { PartialMessage } from "@bufbuild/protobuf";
import { JadeEstimateCfg, JadeEstimateResponse } from "@grpc/jadeestimate_pb";
import { useQuery } from "@tanstack/react-query";
import { rpc } from "@/server/typedEndpoints";
import { JadeEstimateService } from "@grpc/jadeestimate_connect";
import { placeholderTableData } from "./tableData";
import equal from "fast-deep-equal/react";

interface JadeEstimateFormContextPayload {
  rewardTable: JadeEstimateResponse | undefined;
  updateForm: (to: PartialMessage<JadeEstimateCfg>) => void;
  isLoading: boolean;
}
export const defaultJadeEstimateForm: JadeEstimateFormContextPayload = {
  rewardTable: new JadeEstimateResponse(placeholderTableData),
  updateForm: () => null,
  isLoading: false,
};

export const JadeEstimateFormContext =
  createContext<JadeEstimateFormContextPayload>(defaultJadeEstimateForm);

function useJadeEstimateForm(): JadeEstimateFormContextPayload {
  const [formPayload, setFormPayload] =
    useState<PartialMessage<JadeEstimateCfg>>(defaultValues);

  const {
    data: rewardTable,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jadeEstimate", formPayload],
    queryFn: async () => await rpc(JadeEstimateService).post(formPayload),
    initialData: equal(formPayload, defaultValues)
      ? new JadeEstimateResponse(placeholderTableData)
      : undefined,
    suspense: false,
  });

  function updateForm(to: PartialMessage<JadeEstimateCfg>) {
    setFormPayload(to);
  }

  return { rewardTable, updateForm, isLoading };
}

export const JadeEstimateProvider = ({ children }: { children: ReactNode }) => {
  const value = useJadeEstimateForm();
  return (
    <JadeEstimateFormContext.Provider value={value}>
      {children}
    </JadeEstimateFormContext.Provider>
  );
};
