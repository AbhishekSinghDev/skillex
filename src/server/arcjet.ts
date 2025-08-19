import "server-only";

import { env } from "@/env";
import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";

export { detectBot, fixedWindow, protectSignup, shield, slidingWindow };

export const arc = arcjet({
  key: env.ARCJET_KEY,
  rules: [shield({ mode: "LIVE" })],
  characteristics: ["fingerprint"],
});
