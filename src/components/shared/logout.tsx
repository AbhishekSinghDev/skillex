"use client";

import { authClient } from "@/lib/auth-client";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
        },
        onError: () => {
          toast.error("Failed to log out");
        },
      },
    });
  };

  return (
    <Button variant="destructive" onClick={handleLogout} className="w-full">
      <IconLogout />
      Log out
    </Button>
  );
};

export default Logout;
