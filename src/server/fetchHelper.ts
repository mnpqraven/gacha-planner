"use server";
import { EndpointValue } from "./endpoints";

export async function workerFetch<T>(
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
        payload?: any;
        method?: "POST" | "DELETE";
      }
): Promise<T> {
  const body = JSON.stringify(payload);
  const res = await fetch(process.env.WORKER_API + endpoint, {
    body,
    method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json() as T;
  } else return Promise.reject(`unknown error ${res.text()}`);
}
