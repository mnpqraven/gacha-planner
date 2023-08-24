"use client";

import { useToast } from "@/app/components/ui/Toast/useToast";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { MihomoResponse } from "../types";
import { env } from "@/envSchema.mjs";
import { LANGS } from "@/lib/constants";

interface ProfileParam {
  uid: string;
  lang: Lang;
}

export const optionsMihomoInfo = (
  uid: string | undefined = "",
  lang: Lang = "en",
  isServer = false
) =>
  queryOptions<MihomoResponse, Error, MihomoResponse>({
    queryKey: ["mihoyoInfo", uid, lang, isServer],
    queryFn: async () =>
      await getMihomoInfo(
        uid,
        lang,
        isServer ? env.NEXT_PUBLIC_BASE_URL : undefined
      ),
  });

export function useMihomoInfo(
  { uid, lang }: Partial<ProfileParam>,
  opt: Options = {}
) {
  const displayToast = opt.displayToast ?? true;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    ...optionsMihomoInfo(uid, lang),
    enabled: !!uid && uid !== "",
    ...opt,
  });

  function prefetch(uid: string, lang: Lang = "en") {
    queryClient.prefetchQuery(optionsMihomoInfo(uid, lang));
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

export function useSuspendedMihomoInfo(
  { uid, lang }: Partial<ProfileParam>,
  opt: SuspendedOptions = {}
) {
  const displayToast = opt.displayToast ?? true;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useSuspenseQuery({
    ...optionsMihomoInfo(uid, lang, true),
    ...opt,
  });

  function prefetch(uid: string, lang: Lang = "en") {
    queryClient.prefetchQuery(optionsMihomoInfo(uid, lang, true));
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

type Lang = (typeof LANGS)[number];

interface Options
  extends Omit<
    UseQueryOptions<MihomoResponse, Error, MihomoResponse>,
    "queryKey" | "queryFn"
  > {
  displayToast?: boolean;
}

interface SuspendedOptions
  extends Omit<
    UseSuspenseQueryOptions<MihomoResponse, Error, MihomoResponse>,
    "queryKey" | "queryFn"
  > {
  displayToast?: boolean;
}
