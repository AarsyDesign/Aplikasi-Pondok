import { Card } from "@/components/ui/Card";
import { Grade } from "@/types/grade";
import { Student } from "@/types/student";

type NilaiSummaryProps = {
  grades: Grade[];
  student: Student | undefined;
};

export function NilaiSummary({ grades, student }: NilaiSummaryProps) {
  const firstGrade = grades[0];

  return (
    <Card>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <dt className="text-sm text-slate-500">Nama santri</dt>
          <dd className="mt-1 font-semibold text-slate-950">{student?.full_name ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">NIS</dt>
          <dd className="mt-1 font-semibold text-slate-950">{student?.nis ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Kelas / Marhalah</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {student?.className ?? firstGrade?.className ?? "-"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Tahun Ajaran</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {firstGrade?.academicYearName ?? "-"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Semester</dt>
          <dd className="mt-1 font-semibold text-slate-950">
            {firstGrade?.semesterName ?? "-"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
