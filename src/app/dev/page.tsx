"use client";
// can possibly use RSC here

import { useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/Button";
import { workerFetch } from "@/server/fetchHelper";
import ENDPOINT from "@/server/endpoints";

export default function Dev() {
  const mutation = useMutation({
    mutationKey: ["dev"],
    mutationFn: async () =>
      await workerFetch(ENDPOINT.mhy, {
        payload: { id: 805768477 },
        method: "POST",
      }),
  });

  return <Button onClick={() => mutation.mutate()}>request</Button>;
}
