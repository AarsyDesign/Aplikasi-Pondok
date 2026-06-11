import Link from "next/link";
import { Card } from "@/components/ui/Card";

const settings = [
  {
    description: "Kelola profil pengguna aplikasi, nama lengkap, dan role admin, guru, atau bendahara.",
    href: "/dashboard/pengaturan/pengguna",
    title: "Pengguna",
  },
  {
    description: "Atur nama lembaga, alamat, mudir, wali kelas default, dan catatan raport.",
    href: "/dashboard/pengaturan/profil-lembaga",
    title: "Profil Lembaga",
  },
  {
    description: "Kelola periode tahun ajaran yang dipakai untuk nilai, raport, dan SPP.",
    href: "/dashboard/pengaturan/tahun-ajaran",
    title: "Tahun Ajaran",
  },
  {
    description: "Kelola semester dalam setiap tahun ajaran untuk input nilai dan raport.",
    href: "/dashboard/pengaturan/semester",
    title: "Semester",
  },
];

export default function PengaturanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Pengaturan</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pengaturan ini dipakai untuk merapikan data nilai, raport, dan SPP.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition hover:border-emerald-300 hover:shadow-md">
              <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
