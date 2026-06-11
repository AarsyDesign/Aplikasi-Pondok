"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllowedMenus } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/profile";

export function Sidebar({ role }: { role: UserRole | null }) {
  const pathname = usePathname();
  const menuItems = getAllowedMenus(role);

  return (
    <aside className="no-print border-slate-200 bg-white/95 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-72 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Pesantren
          </p>
          <p className="mt-1 text-lg font-bold text-slate-950">
            Santri Report
          </p>
        </div>
        {!role ? (
          <div className="mx-4 mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Profil pengguna belum diatur. Hubungi admin.
          </div>
        ) : null}
        <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:overflow-visible lg:py-6">
          {menuItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800",
                  active && "bg-emerald-700 text-white hover:bg-emerald-700 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
