"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getAllowedMenus } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/profile";

function getMenuGroup(href: string) {
  if (
    href.includes("/spp")
  ) {
    return "Keuangan";
  }

  if (
    href.includes("/pengaturan") ||
    href.includes("/profil-saya") ||
    href.includes("/tentang")
  ) {
    return "Pengaturan";
  }

  return "Akademik";
}

export function Sidebar({
  institutionName,
  role,
}: {
  institutionName: string;
  role: UserRole | null;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = getAllowedMenus(role);
  const groupedMenus = menuItems.reduce<Record<string, typeof menuItems>>(
    (groups, item) => {
      const group = getMenuGroup(item.href);
      groups[group] = [...(groups[group] ?? []), item];
      return groups;
    },
    {},
  );
  const groupOrder = ["Akademik", "Keuangan", "Pengaturan"];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200/80 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          Pesantren
        </p>
        <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
          Santri Report
        </p>
        <p className="mt-1 text-sm font-semibold text-emerald-800">
          {institutionName}
        </p>
        <p className="mt-1 text-xs text-slate-500">Aplikasi internal v1.0</p>
      </div>
      {!role ? (
        <div className="mx-4 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          Profil pengguna belum lengkap. Hubungi admin.
        </div>
      ) : null}
      <nav className="flex flex-col gap-1 overflow-y-auto px-4 py-5">
        {groupOrder.map((group) => {
          const items = groupedMenus[group] ?? [];

          if (items.length === 0) {
            return null;
          }

          return (
            <div key={group} className="space-y-1">
              <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {group}
              </p>
              {items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-900",
                      active &&
                        "bg-emerald-800 text-white shadow-sm hover:bg-emerald-800 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <div className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Santri Report
            </p>
            <p className="truncate text-sm font-semibold text-slate-950">
              {institutionName}
            </p>
          </div>
          <button
            aria-expanded={isOpen}
            aria-label="Buka menu"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            onClick={() => setIsOpen(true)}
            type="button"
          >
            Menu
          </button>
        </div>
      </div>

      <aside className="no-print hidden border-slate-200/80 bg-white/95 shadow-sm lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:block lg:w-72 lg:border-r">
        {sidebarContent}
      </aside>

      {isOpen ? (
        <div
          className="no-print fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}
      {isOpen ? (
        <aside className="no-print fixed inset-y-0 left-0 z-50 w-80 max-w-[86vw] border-r border-slate-200 bg-white shadow-2xl lg:hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <p className="text-sm font-bold text-slate-950">Menu Aplikasi</p>
            <button
              aria-label="Tutup menu"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Tutup
            </button>
          </div>
          {sidebarContent}
        </aside>
      ) : null}
    </>
  );
}
