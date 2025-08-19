import "server-only";

import { env } from "@/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { db } from "./db";

import LoginEmailTemplate from "@/components/templates/login-email-template";
import { EMAIL_LOGIN_OTP_LENGTH } from "@/lib/constant";
import * as schema from "@/server/db/schema";
import { resend } from "./resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
    camelCase: false,
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 15 * 60 * 1000, // 15 mins
    },
  },
  plugins: [
    emailOTP({
      otpLength: EMAIL_LOGIN_OTP_LENGTH,
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Skillex <onboarding@resend.dev>",
          to: [email],
          subject: "Your Skillex Login Code",
          html: LoginEmailTemplate({
            email,
            otp,
            firstName: "User",
          }),
        });
      },
    }),
  ],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
});
