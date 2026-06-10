"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Student } from "@/types/student";

type SantriTableProps = {
  students: Student[];
  deletingId?: string;
  onDelete: (student: Student) => void;
};

export function SantriTable({ students, deletingId, onDelete }: SantriTableProps) {
  if (students.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada data santri.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "NIS", "Nama", "Kelas / Marhalah", "Jenis Kelamin", "Status", "Aksi"].map(
                (header) => (
                  <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student, index) => (
              <tr key={student.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 text-slate-700">{student.nis || "-"}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{student.full_name}</td>
                <td className="px-4 py-3 text-slate-700">{student.className}</td>
                <td className="px-4 py-3 text-slate-700">{student.gender || "-"}</td>
                <td className="px-4 py-3 text-slate-700">{student.status}</td>
                <td className="px-4 py-3">
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
