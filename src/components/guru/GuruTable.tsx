"use client";

import { Button } from "@/components/ui/Button";
import { Teacher } from "@/types/teacher";

type GuruTableProps = {
  deletingId?: string;
  onDelete: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  teachers: Teacher[];
};

export function GuruTable({ deletingId, onDelete, onEdit, teachers }: GuruTableProps) {
  if (teachers.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada data guru.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "Nama Guru", "Nomor HP", "Alamat", "Status", "Aksi"].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{teacher.full_name}</td>
                <td className="px-4 py-3 text-slate-700">{teacher.phone || "-"}</td>
                <td className="max-w-lg px-4 py-3 text-slate-700">{teacher.address || "-"}</td>
                <td className="px-4 py-3 text-slate-700">{teacher.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => onEdit(teacher)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-red-700 hover:bg-red-50"
                      disabled={deletingId === teacher.id}
                      onClick={() => onDelete(teacher)}
                    >
                      {deletingId === teacher.id ? "Menghapus..." : "Hapus"}
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
