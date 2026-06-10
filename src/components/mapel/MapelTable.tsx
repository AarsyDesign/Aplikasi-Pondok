"use client";

import { Button } from "@/components/ui/Button";
import { Subject } from "@/types/subject";

type MapelTableProps = {
  deletingId?: string;
  onDelete: (subject: Subject) => void;
  onEdit: (subject: Subject) => void;
  subjects: Subject[];
};

export function MapelTable({
  deletingId,
  onDelete,
  onEdit,
  subjects,
}: MapelTableProps) {
  if (subjects.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada data mata pelajaran.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "Nama Mata Pelajaran", "Kelas / Marhalah", "Deskripsi", "Aksi"].map(
                (header) => (
                  <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjects.map((subject, index) => (
              <tr key={subject.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{subject.name}</td>
                <td className="px-4 py-3 text-slate-700">{subject.className}</td>
                <td className="max-w-lg px-4 py-3 text-slate-700">
                  {subject.description || "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => onEdit(subject)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-red-700 hover:bg-red-50"
                      disabled={deletingId === subject.id}
                      onClick={() => onDelete(subject)}
                    >
                      {deletingId === subject.id ? "Menghapus..." : "Hapus"}
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
