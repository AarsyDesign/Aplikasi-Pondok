import type { UserRole } from "@/types/profile";

export type DashboardMenuItem = {
  label: string;
  href: string;
};

const commonMenus: DashboardMenuItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profil Saya", href: "/dashboard/profil-saya" },
];

const adminMenus: DashboardMenuItem[] = [
  ...commonMenus,
  { label: "Santri", href: "/dashboard/santri" },
  { label: "Kelas / Marhalah", href: "/dashboard/kelas" },
  { label: "Mata Pelajaran", href: "/dashboard/mapel" },
  { label: "Input Nilai", href: "/dashboard/nilai" },
  { label: "Raport", href: "/dashboard/raport" },
  { label: "Guru", href: "/dashboard/guru" },
  { label: "Absensi Guru", href: "/dashboard/absensi-guru" },
  { label: "SPP", href: "/dashboard/spp" },
  { label: "Tagihan SPP", href: "/dashboard/spp/tagihan" },
  { label: "Pembayaran SPP", href: "/dashboard/spp/pembayaran" },
  { label: "Pengingat SPP", href: "/dashboard/spp/pengingat" },
  { label: "Rekap Tunggakan", href: "/dashboard/spp/rekap" },
  { label: "Pengaturan", href: "/dashboard/pengaturan" },
  { label: "Pengaturan > Pengguna", href: "/dashboard/pengaturan/pengguna" },
];

const guruMenus: DashboardMenuItem[] = [
  ...commonMenus,
  { label: "Santri", href: "/dashboard/santri" },
  { label: "Input Nilai", href: "/dashboard/nilai" },
  { label: "Raport", href: "/dashboard/raport" },
  { label: "Guru", href: "/dashboard/guru" },
  { label: "Absensi Guru", href: "/dashboard/absensi-guru" },
];

const bendaharaMenus: DashboardMenuItem[] = [
  ...commonMenus,
  { label: "Santri", href: "/dashboard/santri" },
  { label: "SPP", href: "/dashboard/spp" },
  { label: "Tagihan SPP", href: "/dashboard/spp/tagihan" },
  { label: "Pembayaran SPP", href: "/dashboard/spp/pembayaran" },
  { label: "Pengingat SPP", href: "/dashboard/spp/pengingat" },
  { label: "Rekap Tunggakan", href: "/dashboard/spp/rekap" },
];

const allowedRoutePrefixes: Record<UserRole, string[]> = {
  admin: ["/dashboard"],
  guru: [
    "/dashboard/profil-saya",
    "/dashboard/santri",
    "/dashboard/nilai",
    "/dashboard/raport",
    "/dashboard/guru",
    "/dashboard/absensi-guru",
  ],
  bendahara: [
    "/dashboard/profil-saya",
    "/dashboard/santri",
    "/dashboard/spp",
  ],
};

const menuByRole: Record<UserRole, DashboardMenuItem[]> = {
  admin: adminMenus,
  guru: guruMenus,
  bendahara: bendaharaMenus,
};

function routeMatches(pathname: string, routePrefix: string) {
  return pathname === routePrefix || pathname.startsWith(`${routePrefix}/`);
}

export function getAllowedMenus(role: UserRole | null): DashboardMenuItem[] {
  if (!role) {
    return [{ label: "Profil Saya", href: "/dashboard/profil-saya" }];
  }

  return menuByRole[role];
}

export function canAccessRoute(role: UserRole | null, pathname: string) {
  if (pathname === "/dashboard/akses-ditolak") {
    return true;
  }

  if (!role) {
    return pathname === "/dashboard/profil-saya";
  }

  if (role === "admin") {
    return pathname === "/dashboard" || routeMatches(pathname, "/dashboard");
  }

  if (pathname === "/dashboard") {
    return true;
  }

  return allowedRoutePrefixes[role].some((routePrefix) =>
    routeMatches(pathname, routePrefix),
  );
}
