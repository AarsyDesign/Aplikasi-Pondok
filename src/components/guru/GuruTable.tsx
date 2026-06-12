"use client";

import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        Belum ada data guru.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {["No", "Nama Guru", "Nomor HP", "Alamat", "Status", "Aksi"].map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teachers.map((teacher, index) => (
              <tr key={teacher.id} className="transition hover:bg-emerald-50/40">
                <td className="px-4 py-3.5 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-950">{teacher.full_name}</td>
                <td className="px-4 py-3.5 text-slate-700">{teacher.phone || "-"}</td>
                <td className="max-w-lg px-4 py-3.5 text-slate-700">{teacher.address || "-"}</td>
                <td className="px-4 py-3.5"><StatusBadge status={teacher.status} /></td>
                <td className="px-4 py-3.5">
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
