"use client";

import { useMutation } from "@tanstack/react-query";
import { MihomoResponse } from "../types";

export function useMihomoInfo() {
  const mutation = useMutation({
    mutationKey: ["mihoyoInfo"],
    mutationFn: async ({ uid, lang }: { uid: string; lang: string }) =>
      await fetch(`/api/profile/${uid}?lang=${lang}`)
        .then((data) => data.json() as Promise<MihomoResponse>)
        .catch((err) => {
          console.log("ree");
          return Promise.reject(err);
        }),
  });
  return { mutation };
}
