import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    EDGE_CONFIG: z.string().url().min(1),
    DB_URL: z.string().url().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().min(1),
    NEXT_PUBLIC_WORKER_API: z.string().url().min(1),
    NEXT_PUBLIC_DB_CENTER: z.string().url().min(1),
  },
  runtimeEnv: {
    DB_URL: process.env["DB_URL"],
    EDGE_CONFIG: process.env["EDGE_CONFIG"],
    NEXT_PUBLIC_BASE_URL: process.env["NEXT_PUBLIC_BASE_URL"],
    NEXT_PUBLIC_WORKER_API: process.env["NEXT_PUBLIC_WORKER_API"],
    NEXT_PUBLIC_DB_CENTER: process.env["NEXT_PUBLIC_DB_CENTER"],
  },
});
