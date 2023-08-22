import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    EDGE_CONFIG: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_WORKER_API: z.string().url(),
  },
  runtimeEnv: {
    EDGE_CONFIG: process.env["EDGE_CONFIG"],
    NEXT_PUBLIC_BASE_URL: process.env["NEXT_PUBLIC_BASE_URL"],
    NEXT_PUBLIC_WORKER_API: process.env["NEXT_PUBLIC_WORKER_API"],
  },
});
