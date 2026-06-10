import { Report } from "@/types/report";

function IdentityRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid grid-cols-[132px_12px_1fr] gap-2">
      <span>{label}</span>
      <span>:</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

export function RaportHeader({ report }: { report: Report }) {
  const institution = report.institution;

  return (
    <header>
      <div className="border-b-4 border-double border-slate-950 pb-5 text-center">
        <p className="text-xl font-bold uppercase tracking-wide">
          {institution.name}
        </p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em]">
          {institution.city || report.publishedAt}
        </p>
        {institution.address ? (
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-slate-700">{institution.address}</p>
        ) : null}
        <h2 className="mt-4 text-lg font-bold uppercase tracking-wide">
          RAPORT HASIL BELAJAR SANTRI
        </h2>
      </div>

      <section className="mt-7 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <IdentityRow label="Nama Santri" value={report.student.full_name} />
        <IdentityRow label="NIS" value={report.student.nis} />
        <IdentityRow label="Kelas / Marhalah" value={report.student.className} />
        <IdentityRow label="Semester" value={report.semester} />
        <IdentityRow label="Tahun Ajaran" value={report.academicYear} />
      </section>
    </header>
  );
}
