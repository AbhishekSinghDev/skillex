import { env } from "@/env";
import { auth } from "@/server/auth";
import {
  customSessionClient,
  emailOTPClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [emailOTPClient(), customSessionClient<typeof auth>()],
});
