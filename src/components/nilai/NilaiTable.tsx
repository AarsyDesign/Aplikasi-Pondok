"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Grade } from "@/types/grade";

type NilaiTableProps = {
  grades: Grade[];
  mode?: "summary" | "detail";
  deletingId?: string;
  onDelete?: (grade: Grade) => void;
};

export function NilaiTable({
  deletingId,
  grades,
  mode = "summary",
  onDelete,
}: NilaiTableProps) {
  if (grades.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        Belum ada data nilai.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {(mode === "summary"
                ? [
                    "No",
                    "Santri",
                    "Kelas / Marhalah",
                    "Mata Pelajaran",
                    "Tahun Ajaran",
                    "Semester",
                    "Nilai Akhir",
                    "Aksi",
                  ]
                : [
                    "No",
                    "Mata Pelajaran",
                    "Nilai Harian",
                    "Nilai Tugas",
                    "Nilai Ujian",
                    "Nilai Akhir",
                    "Catatan Guru",
                  ]
              ).map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {grades.map((grade, index) => (
              <tr key={grade.id} className="transition hover:bg-emerald-50/40">
                <td className="px-4 py-3.5 text-slate-600">{index + 1}</td>
                {mode === "summary" ? (
                  <>
                    <td className="px-4 py-3.5 font-semibold text-slate-950">{grade.studentName}</td>
                    <td className="px-4 py-3.5 text-slate-700">{grade.className}</td>
                    <td className="px-4 py-3.5 text-slate-700">{grade.subjectName}</td>
                    <td className="px-4 py-3.5 text-slate-700">{grade.academicYearName}</td>
                    <td className="px-4 py-3.5 text-slate-700">{grade.semesterName}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-950">{grade.final_score ?? "-"}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-2">
                        {grade.studentId ? (
                          <Link
                            className="font-medium text-emerald-700 hover:text-emerald-900"
                            href={`/dashboard/nilai/${grade.studentId}`}
                          >
                            Edit
                          </Link>
                        ) : null}
                        {onDelete ? (
                          <Button
                            type="button"
                            variant="ghost"
                            className="min-h-0 px-2 py-1 text-red-700 hover:bg-red-50"
                            disabled={deletingId === grade.id}
                            onClick={() => onDelete(grade)}
                          >
                            {deletingId === grade.id ? "Menghapus..." : "Hapus"}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3.5 font-semibold text-slate-950">{grade.subjectName}</td>
                    <td className="px-4 py-3.5 text-slate-700">{grade.daily_score ?? "-"}</td>
                    <td className="px-4 py-3.5 text-slate-700">{grade.task_score ?? "-"}</td>
                    <td className="px-4 py-3.5 text-slate-700">{grade.exam_score ?? "-"}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-950">{grade.final_score ?? "-"}</td>
                    <td className="px-4 py-3.5 text-slate-700">{grade.teacher_note ?? "-"}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
