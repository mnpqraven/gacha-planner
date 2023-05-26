"use server";
import { EndpointValue } from "./endpoints";

export async function workerFetch<TReq, TRes>(
  endpoint: EndpointValue,
  {
    payload,
    method = "GET",
  }:
    | {
        payload: never;
        method?: "GET" | "DELETE";
      }
    | {
        payload?: TReq;
        method?: "POST" | "DELETE";
      }
): Promise<TRes> {
  const body = JSON.stringify(payload);
  const url = process.env.WORKER_API + endpoint;
  console.warn(url);
  const res = await fetch(url, {
    body,
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json() as TRes;
  } else return Promise.reject(`unknown error ${res.text()}`);
}
