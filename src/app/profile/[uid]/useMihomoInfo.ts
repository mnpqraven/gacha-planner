"use client";

import { useToast } from "@/app/components/ui/Toast/useToast";
import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { MihomoResponse } from "../types";
import { env } from "@/envSchema.mjs";

interface Options
  extends Omit<
    UseQueryOptions<MihomoResponse>,
    "retry" | "queryKey" | "queryFn"
  > {
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
        description: query.error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.error]);

  return { query, prefetch };
}

export function useSuspendedMihomoInfo({ uid, lang }: Partial<ProfileParam>) {
  const displayToast = false;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["mihoyoInfo", uid, lang],
    queryFn: async () => {
      if (!!uid)
        return await getMihomoInfo(uid, lang, env.NEXT_PUBLIC_BASE_URL);
      else return Promise.reject("running on the server ?");
    },
    retry: false,
    enabled: !!uid && !!lang,
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
        description: "ree",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.error]);

  return { query, prefetch };
}

export async function getMihomoInfo(
  uid: string,
  lang: string = "en",
  host?: string
): Promise<MihomoResponse> {
  let url = `/api/profile/${uid}?lang=${lang}`;
  if (!!host) url = host + url;
  const response = await fetch(url);
  if (!response.ok) {
    return response.json().then(({ error }: { error: string }) => {
      return Promise.reject(error);
    });
  }
  return response.json();
}
