import { SupabaseStatusCard } from "@/components/dashboard/SupabaseStatusCard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_INSTITUTION_PROFILE } from "@/types/institution";

type DashboardSummary = {
  activeAcademicYear: string;
  institution: {
    address: string | null;
    city: string | null;
    email: string | null;
    headmasterName: string | null;
    name: string;
    phone: string | null;
    shortName: string | null;
  };
  unpaidBills: string;
  totalStudents: string;
  totalTeachers: string;
};

async function getDashboardSummary(): Promise<DashboardSummary> {
  const fallback = {
    activeAcademicYear: "-",
    institution: {
      address: DEFAULT_INSTITUTION_PROFILE.address,
      city: DEFAULT_INSTITUTION_PROFILE.city,
      email: DEFAULT_INSTITUTION_PROFILE.email,
      headmasterName: DEFAULT_INSTITUTION_PROFILE.headmaster_name,
      name: DEFAULT_INSTITUTION_PROFILE.name,
      phone: DEFAULT_INSTITUTION_PROFILE.phone,
      shortName: DEFAULT_INSTITUTION_PROFILE.short_name,
    },
    unpaidBills: "-",
    totalStudents: "-",
    totalTeachers: "-",
  };

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallback;
  }

  try {
    const [students, teachers, bills, academicYear, institution] = await Promise.all([
      supabase.from("students").select("id", { count: "exact", head: true }),
      supabase.from("teachers").select("id", { count: "exact", head: true }),
      supabase
        .from("spp_bills")
        .select("id", { count: "exact", head: true })
        .neq("status", "lunas"),
      supabase
        .from("academic_years")
        .select("name")
        .eq("is_active", true)
        .maybeSingle(),
      supabase
        .from("institution_profile")
        .select("name, short_name, address, city, phone, email, headmaster_name")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

    return {
      activeAcademicYear: academicYear.data?.name ?? "-",
      institution: institution.data
        ? {
            address: institution.data.address,
            city: institution.data.city,
            email: institution.data.email,
            headmasterName: institution.data.headmaster_name,
            name: institution.data.name,
            phone: institution.data.phone,
            shortName: institution.data.short_name,
          }
        : fallback.institution,
      unpaidBills: String(bills.count ?? 0),
      totalStudents: String(students.count ?? 0),
      totalTeachers: String(teachers.count ?? 0),
    };
  } catch {
    return fallback;
  }
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const institutionDisplayName =
    summary.institution.shortName || summary.institution.name;
  const location = [summary.institution.address, summary.institution.city]
    .filter(Boolean)
    .join(", ");
  const items = [
    ["Total Santri", summary.totalStudents, "Data santri tersimpan"],
    ["Total Guru", summary.totalTeachers, "Data guru aktif/terdaftar"],
    ["Tagihan SPP Belum Lunas", summary.unpaidBills, "Perlu ditindaklanjuti"],
    ["Tahun Ajaran Aktif", summary.activeAcademicYear, "Periode berjalan"],
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        description="Ringkasan sederhana untuk membantu admin melihat kondisi awal aplikasi."
        eyebrow="Internal Pesantren"
        title="Dashboard"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(([label, value, description]) => (
          <Card key={label}>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {value}
            </p>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {description}
            </p>
          </Card>
        ))}
      </section>

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">
          Profil Singkat Pondok
        </h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-500">Nama lembaga</p>
            <p className="mt-1 font-semibold text-slate-950">
              {institutionDisplayName}
            </p>
            <p className="mt-1 text-slate-600">{summary.institution.name}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-500">Alamat</p>
            <p className="mt-1 text-slate-700">{location || "-"}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-500">Kontak</p>
            <p className="mt-1 text-slate-700">
              {[summary.institution.phone, summary.institution.email]
                .filter(Boolean)
                .join(" / ") || "-"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-500">Mudir / Pimpinan</p>
            <p className="mt-1 text-slate-700">
              {summary.institution.headmasterName || "-"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Selamat Datang</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Gunakan menu di samping untuk mengelola data santri, nilai, raport,
          absensi guru, SPP, dan pengaturan dasar lembaga.
        </p>
      </Card>
      <SupabaseStatusCard />
    </div>
  );
}
