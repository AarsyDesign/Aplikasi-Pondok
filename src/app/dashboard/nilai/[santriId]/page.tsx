import Link from "next/link";
import { NilaiSummary } from "@/components/nilai/NilaiSummary";
import { NilaiTable } from "@/components/nilai/NilaiTable";
import { Button } from "@/components/ui/Button";
import { getGradesByStudentId } from "@/services/gradeService";
import { getStudentById } from "@/services/studentService";

export default async function NilaiSantriPage({
  params,
}: {
  params: Promise<{ santriId: string }>;
}) {
  const { santriId } = await params;
  const [student, grades] = await Promise.all([
    getStudentById(santriId).catch(() => undefined),
    getGradesByStudentId(santriId).catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Nilai {student?.full_name ?? "Santri"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Detail nilai santri berdasarkan data yang sudah diinput.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="secondary">
            <Link href="/dashboard/nilai">Kembali</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/nilai/input">Edit Nilai</Link>
          </Button>
        </div>
      </div>

      <NilaiSummary grades={grades} student={student} />
      <NilaiTable grades={grades} mode="detail" />
    </div>
  );
}
