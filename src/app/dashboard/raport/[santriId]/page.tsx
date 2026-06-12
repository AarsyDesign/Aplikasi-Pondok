import Link from "next/link";
import { PrintButton } from "@/components/raport/PrintButton";
import { RaportFooter } from "@/components/raport/RaportFooter";
import { RaportHeader } from "@/components/raport/RaportHeader";
import { RaportTable } from "@/components/raport/RaportTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getReportByStudent } from "@/services/reportService";

export default async function RaportPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ santriId: string }>;
  searchParams: Promise<{ academicYearId?: string; semesterId?: string }>;
}) {
  const { santriId } = await params;
  const { academicYearId, semesterId } = await searchParams;

  if (!semesterId || !academicYearId) {
    return (
      <div className="space-y-6">
        <Card>
          <p className="text-sm text-slate-700">
            Semester dan tahun ajaran wajib dipilih.
          </p>
          <Button asChild className="mt-4" variant="secondary">
            <Link href="/dashboard/raport">Kembali</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const report = await getReportByStudent(santriId, semesterId, academicYearId).catch(
    () => undefined,
  );

  if (!report) {
    return (
      <div className="space-y-6">
        <Card>
          <p className="text-sm text-slate-700">Data santri tidak ditemukan.</p>
          <Button asChild className="mt-4" variant="secondary">
            <Link href="/dashboard/raport">Kembali</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          actions={
        <>
          <Button asChild variant="secondary">
            <Link href="/dashboard/raport">Kembali</Link>
          </Button>
          <PrintButton />
        </>
          }
          description="Preview raport berdasarkan nilai yang sudah tersimpan."
          title="Raport Santri"
        />
      </div>

      <article className="print-area print-page mx-auto max-w-[210mm] rounded-lg border border-slate-200 bg-white p-10 text-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <RaportHeader report={report} />
        {report.grades.length > 0 ? (
          <RaportTable grades={report.grades} />
        ) : (
          <div className="mt-6 rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600">
            Belum ada data nilai untuk santri ini pada semester dan tahun ajaran yang dipilih.
          </div>
        )}
        <RaportFooter report={report} />
      </article>
    </div>
  );
}
