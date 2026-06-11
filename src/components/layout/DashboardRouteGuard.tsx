"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccessRoute } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/profile";

export function DashboardRouteGuard({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const canAccess = canAccessRoute(role, pathname);

  useEffect(() => {
    if (canAccess) {
      return;
    }

    if (!role) {
      router.replace("/dashboard/profil-saya");
      return;
    }

    router.replace("/dashboard/akses-ditolak");
  }, [canAccess, role, router]);

  if (!canAccess) {
    return null;
  }

  return children;
}
