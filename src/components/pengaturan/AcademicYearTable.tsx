"use client";

import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        Belum ada data tahun ajaran.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {["No", "Tahun Ajaran", "Status", "Aksi"].map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {academicYears.map((academicYear, index) => (
              <tr key={academicYear.id} className="transition hover:bg-emerald-50/40">
                <td className="px-4 py-3.5 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-950">{academicYear.name}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={academicYear.is_active ? "aktif" : "nonaktif"}>
                    {academicYear.is_active ? "Aktif" : "Tidak Aktif"}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3.5">
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
