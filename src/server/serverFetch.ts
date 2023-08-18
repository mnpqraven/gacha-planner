import { env } from "@/envSchema.mjs";

export async function serverFetch<TPayload, TResponse>(
  endpoint: string,
  opt?: {
    payload?: TPayload;
    method: "POST" | "DELETE";
  },
  params?: string | number
): Promise<TResponse> {
  let url = env.NEXT_PUBLIC_WORKER_API + endpoint;
  if (params) {
    if (url.includes(":id")) url = url.replace(":id", `${params}`);
    else url += `/${params}`;
  }

  // POST
  if (opt) {
    const { payload, method } = opt;
    const body = JSON.stringify(payload);
    const res = await fetch(url, {
      body,
      headers: {
        "Content-Type": "application/json",
      },
      method,
    });

    if (res.ok) {
      return res.json();
    } else {
      console.error("api fetch failed, code:", res.status);
      console.error("url:", url);
      const errText = await res.text();
      console.error("unknown error", errText);
      return Promise.reject(`unknown error ${errText}`);
    }
  } else {
    // GET
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (res.ok) {
      return res.json();
    } else {
      console.error("api fetch failed, code:", res.status);
      console.error("url:", url);
      return Promise.reject(`unknown error ${await res.text()}`);
    }
  }
}
