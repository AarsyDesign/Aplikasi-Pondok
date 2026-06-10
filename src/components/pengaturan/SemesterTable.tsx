"use client";

import { Button } from "@/components/ui/Button";
import { Semester } from "@/types/semester";

type SemesterTableProps = {
  activatingId?: string;
  deletingId?: string;
  onActivate: (semester: Semester) => void;
  onDelete: (semester: Semester) => void;
  onEdit: (semester: Semester) => void;
  semesters: Semester[];
};

export function SemesterTable({
  activatingId,
  deletingId,
  onActivate,
  onDelete,
  onEdit,
  semesters,
}: SemesterTableProps) {
  if (semesters.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada data semester.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "Semester", "Tahun Ajaran", "Status", "Aksi"].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {semesters.map((semester, index) => (
              <tr key={semester.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{semester.name}</td>
                <td className="px-4 py-3 text-slate-700">{semester.academicYearName}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${semester.is_active ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-600 ring-slate-200"}`}>
                    {semester.is_active ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="ghost" className="min-h-0 px-2 py-1" onClick={() => onEdit(semester)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1"
                      disabled={Boolean(semester.is_active) || activatingId === semester.id}
                      onClick={() => onActivate(semester)}
                    >
                      {activatingId === semester.id ? "Mengaktifkan..." : "Aktifkan"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-red-700 hover:bg-red-50"
                      disabled={deletingId === semester.id}
                      onClick={() => onDelete(semester)}
                    >
                      {deletingId === semester.id ? "Menghapus..." : "Hapus"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
