import { Report } from "@/types/report";

export function RaportFooter({ report }: { report: Report }) {
  return (
    <footer className="mt-8 text-sm">
      <section>
        <p className="font-semibold">Catatan Umum</p>
        <p className="mt-2 min-h-20 border border-slate-400 p-3 leading-relaxed">
          {report.note}
        </p>
      </section>

      <p className="mt-8 text-right">{report.publishedAt || "Pontianak"}, ....................</p>

      <section className="mt-4 grid grid-cols-3 gap-6 text-center">
        <div>
          <p>Wali Kelas</p>
          <p className="mt-20 font-semibold">(....................)</p>
          <p className="mt-1 text-xs text-slate-600">{report.homeroomTeacher}</p>
        </div>
        <div>
          <p>Orang Tua / Wali</p>
          <p className="mt-20 font-semibold">(....................)</p>
        </div>
        <div>
          <p>Mudir</p>
          <p className="mt-20 font-semibold">(....................)</p>
          <p className="mt-1 text-xs text-slate-600">{report.mudir}</p>
        </div>
      </section>
    </footer>
  );
}
