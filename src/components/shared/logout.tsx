"use client";

import { authClient } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";

const Logout = () => {
  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <Button variant="outline" onClick={handleLogout} size="icon">
      <LogOutIcon />
    </Button>
  );
};

export default Logout;
