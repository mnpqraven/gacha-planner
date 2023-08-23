"use client";

import { getMihomoInfo } from "@/app/api/profile/[uid]/route";
import { useToast } from "@/app/components/ui/Toast/useToast";
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { MihomoResponse } from "../types";

interface Options
  extends Omit<UseQueryOptions<MihomoResponse>, "enabled" | "retry"> {
  displayToast?: boolean;
}

interface ProfileParam {
  uid: string;
  lang: string;
}

export function useMihomoInfo(
  { uid, lang }: Partial<ProfileParam>,
  opt: Options = {}
) {
  const displayToast = opt.displayToast ?? true;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["mihoyoInfo", uid, lang],
    queryFn: async () => await getMihomoInfo(uid!, lang!),
    retry: false,
    enabled: !!uid && !!lang,
    ...opt,
  });

  function prefetch(uid: string, lang: string = "en") {
    queryClient.prefetchQuery({
      queryKey: ["mihoyoInfo", uid, lang],
      queryFn: async () => await getMihomoInfo(uid, lang),
    });
  }

  useEffect(() => {
    if (!!query.error && displayToast) {
      toast({
        variant: "destructive",
        title: "Error encountered",
        description: query.error as string,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.error]);

  return { query, prefetch };
}
