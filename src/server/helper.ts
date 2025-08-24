import "server-only";

import { headers } from "next/headers";
import { auth } from "./auth";

export const requireAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return session;
};
