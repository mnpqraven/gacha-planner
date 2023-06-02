"use client";

import * as z from "zod";
import { ENDPOINT, ENV } from "./endpoints";

export async function workerFetch<
  TEndpoint extends (typeof ENDPOINT)[keyof typeof ENDPOINT]
>(
  endpoint: TEndpoint,
  opt?: {
    payload?: z.infer<
      TEndpoint["payload"] extends z.ZodTypeAny ? TEndpoint["payload"] : never
    >;
    method: "POST" | "DELETE";
  }
): Promise<z.infer<TEndpoint["response"]>> {
  const url = ENV.WORKER_API + endpoint.path;

  // POST
  if (opt) {
    const { payload, method } = opt;
    const body = JSON.stringify(payload);
    const res = await fetch(url, {
      body,
      headers: { "Content-Type": "application/json" },
      method,
    });

    if (res.ok) {
      return res.json();
    } else {
      console.error("api fetch failed, code:", res.status);
      const errText = await res.text();
      console.error("unknown error", errText);
      return Promise.reject(`unknown error ${errText}`);
    }
  } else {
    // GET
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });

    if (res.ok) {
      return res.json();
    } else {
      console.error("api fetch failed, code:", res.status);
      return Promise.reject(`unknown error ${res.text()}`);
    }
  }
}
