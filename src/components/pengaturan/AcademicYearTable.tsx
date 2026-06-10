"use client";

import { Button } from "@/components/ui/Button";
import { AcademicYear } from "@/types/academicYear";

type AcademicYearTableProps = {
  academicYears: AcademicYear[];
  deletingId?: string;
  activatingId?: string;
  onActivate: (academicYear: AcademicYear) => void;
  onDelete: (academicYear: AcademicYear) => void;
  onEdit: (academicYear: AcademicYear) => void;
};

export function AcademicYearTable({
  academicYears,
  activatingId,
  deletingId,
  onActivate,
  onDelete,
  onEdit,
}: AcademicYearTableProps) {
  if (academicYears.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada data tahun ajaran.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "Tahun Ajaran", "Status", "Aksi"].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {academicYears.map((academicYear, index) => (
              <tr key={academicYear.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{academicYear.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${academicYear.is_active ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-slate-50 text-slate-600 ring-slate-200"}`}>
                    {academicYear.is_active ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="ghost" className="min-h-0 px-2 py-1" onClick={() => onEdit(academicYear)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1"
                      disabled={Boolean(academicYear.is_active) || activatingId === academicYear.id}
                      onClick={() => onActivate(academicYear)}
                    >
                      {activatingId === academicYear.id ? "Mengaktifkan..." : "Aktifkan"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-red-700 hover:bg-red-50"
                      disabled={deletingId === academicYear.id}
                      onClick={() => onDelete(academicYear)}
                    >
                      {deletingId === academicYear.id ? "Menghapus..." : "Hapus"}
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
