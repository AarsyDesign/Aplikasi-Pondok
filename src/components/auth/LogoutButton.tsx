"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/services/authService";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutAdmin();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      disabled={isLoggingOut}
      onClick={handleLogout}
      type="button"
      variant="secondary"
    >
      {isLoggingOut ? "Keluar..." : "Logout"}
    </Button>
  );
}
