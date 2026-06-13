"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatResidenceType } from "@/lib/utils";
import { Student } from "@/types/student";

type SantriTableProps = {
  students: Student[];
  deletingId?: string;
  onDelete: (student: Student) => void;
};

export function SantriTable({ students, deletingId, onDelete }: SantriTableProps) {
  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        Belum ada data santri.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {["No", "NIS", "Nama", "Kelas / Marhalah", "Status Santri", "Jenis Kelamin", "Status", "Aksi"].map(
                (header) => (
                  <th key={header} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student, index) => (
              <tr key={student.id} className="transition hover:bg-emerald-50/40">
                <td className="px-4 py-3.5 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3.5 text-slate-700">{student.nis || "-"}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-950">{student.full_name}</td>
                <td className="px-4 py-3.5 text-slate-700">{student.className}</td>
                <td className="px-4 py-3.5"><StatusBadge status={student.residence_type}>{formatResidenceType(student.residence_type)}</StatusBadge></td>
                <td className="px-4 py-3.5 text-slate-700">{student.gender || "-"}</td>
                <td className="px-4 py-3.5"><StatusBadge status={student.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      className="font-medium text-emerald-700 hover:text-emerald-900"
                      href={`/dashboard/santri/${student.id}`}
                    >
                      Detail
                    </Link>
                    <Link
                      className="font-medium text-slate-700 hover:text-slate-950"
                      href={`/dashboard/santri/${student.id}?mode=edit`}
                    >
                      Edit
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-red-700 hover:bg-red-50"
                      disabled={deletingId === student.id}
                      onClick={() => onDelete(student)}
                    >
                      {deletingId === student.id ? "Menghapus..." : "Hapus"}
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
