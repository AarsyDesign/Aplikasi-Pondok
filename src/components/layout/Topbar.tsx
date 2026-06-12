"use client";

import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Badge } from "@/components/ui/Badge";
import { formatRoleLabel } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/profile";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/absensi-guru": "Absensi Guru",
  "/dashboard/guru": "Data Guru",
  "/dashboard/kelas": "Kelas / Marhalah",
  "/dashboard/mapel": "Mata Pelajaran",
  "/dashboard/nilai": "Data Nilai",
  "/dashboard/nilai/input": "Input Nilai",
  "/dashboard/pengaturan": "Pengaturan",
  "/dashboard/pengaturan/pengguna": "Manajemen Pengguna",
  "/dashboard/pengaturan/profil-lembaga": "Profil Lembaga",
  "/dashboard/pengaturan/semester": "Semester",
  "/dashboard/pengaturan/tahun-ajaran": "Tahun Ajaran",
  "/dashboard/profil-saya": "Profil Saya",
  "/dashboard/raport": "Raport",
  "/dashboard/santri": "Data Santri",
  "/dashboard/spp": "SPP Santri",
  "/dashboard/spp/pembayaran": "Input Pembayaran SPP",
  "/dashboard/spp/pengingat": "Pengingat SPP",
  "/dashboard/spp/rekap": "Rekap Tunggakan SPP",
  "/dashboard/spp/tagihan": "Tagihan SPP",
  "/dashboard/tentang": "Tentang Aplikasi",
};

function getPageTitle(pathname: string) {
  const exactTitle = pageTitles[pathname];

  if (exactTitle) {
    return exactTitle;
  }

  const matchedPath = Object.keys(pageTitles)
    .filter((path) => pathname.startsWith(`${path}/`))
    .sort((a, b) => b.length - a.length)[0];

  return matchedPath ? pageTitles[matchedPath] : "Santri Report";
}

export function Topbar({
  email,
  fullName,
  role,
}: {
  email: string;
  fullName: string | null;
  role: UserRole | null;
}) {
  const pathname = usePathname();
  const displayName = fullName ?? email;
  const displayRole = formatRoleLabel(role);
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="no-print sticky top-[65px] z-10 border-b border-slate-200/80 bg-slate-50/90 px-4 py-4 backdrop-blur sm:px-6 lg:top-0 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Halaman
          </p>
          <p className="mt-1 text-lg font-bold tracking-tight text-slate-950">
            {pageTitle}
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="text-right text-sm">
            <p className="max-w-48 truncate font-semibold text-slate-800">
              {displayName}
            </p>
            <Badge className="mt-1" variant={role ? "success" : "warning"}>
              {displayRole}
            </Badge>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
