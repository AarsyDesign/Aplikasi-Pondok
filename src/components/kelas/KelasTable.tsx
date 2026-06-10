"use client";

import { Button } from "@/components/ui/Button";
import { ClassGroup } from "@/types/class";

type KelasTableProps = {
  classes: ClassGroup[];
  deletingId?: string;
  onDelete: (classGroup: ClassGroup) => void;
  onEdit: (classGroup: ClassGroup) => void;
};

export function KelasTable({
  classes,
  deletingId,
  onDelete,
  onEdit,
}: KelasTableProps) {
  if (classes.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada data kelas / marhalah.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "Nama Kelas / Marhalah", "Tingkatan", "Deskripsi", "Aksi"].map(
                (header) => (
                  <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.map((classGroup, index) => (
              <tr key={classGroup.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{classGroup.name}</td>
                <td className="px-4 py-3 text-slate-700">{classGroup.level || "-"}</td>
                <td className="max-w-lg px-4 py-3 text-slate-700">
                  {classGroup.description || "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => onEdit(classGroup)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-0 px-2 py-1 text-red-700 hover:bg-red-50"
                      disabled={deletingId === classGroup.id}
                      onClick={() => onDelete(classGroup)}
                    >
                      {deletingId === classGroup.id ? "Menghapus..." : "Hapus"}
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
