import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url().nonempty(),
    BETTER_AUTH_SECRET: z.string().nonempty(),
    BETTER_AUTH_URL: z.url().nonempty(),
    GITHUB_CLIENT_ID: z.string().nonempty(),
    GITHUB_CLIENT_SECRET: z.string().nonempty(),
    RESEND_API_KEY: z.string().nonempty(),
    ARCJET_KEY: z.string().nonempty(),
  },
  client: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url().nonempty(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ARCJET_KEY: process.env.ARCJET_KEY,

    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  },
});
