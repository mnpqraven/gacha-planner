"use client";

import { getMihomoInfo } from "@/app/api/profile/[uid]/route";
import { useToast } from "@/app/components/ui/Toast/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface Options {
  displayToast: boolean;
}
export function useMihomoInfo(
  {
    uid,
    lang,
  }: {
    uid: string | undefined;
    lang: string | undefined;
  },
  { displayToast }: Options = { displayToast: true }
) {
  const { toast } = useToast();
  const query = useQuery({
    queryKey: ["mihoyoInfo", uid, lang],
    queryFn: async () => await getMihomoInfo(uid!, lang!),
    retry: false,
    enabled: !!uid && !!lang,
  });

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
  return { query };
}
