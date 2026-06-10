"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatRupiah, getMonthName, SppBill } from "@/types/spp";

type SppBillTableProps = {
  bills: SppBill[];
  deletingId?: string;
  onDelete?: (bill: SppBill) => void;
  onEdit?: (bill: SppBill) => void;
};

export function SppBillTable({ bills, deletingId, onDelete, onEdit }: SppBillTableProps) {
  if (bills.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada data tagihan SPP.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "Nama Santri", "Kelas / Marhalah", "Bulan", "Tahun", "Nominal", "Terbayar", "Sisa", "Status", "Aksi"].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map((bill, index) => (
              <tr key={bill.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{bill.studentName}</td>
                <td className="px-4 py-3 text-slate-700">{bill.className}</td>
                <td className="px-4 py-3 text-slate-700">{getMonthName(bill.bill_month)}</td>
                <td className="px-4 py-3 text-slate-700">{bill.bill_year}</td>
                <td className="px-4 py-3 text-slate-700">{formatRupiah(bill.amount)}</td>
                <td className="px-4 py-3 text-slate-700">{formatRupiah(bill.totalPaid)}</td>
                <td className="px-4 py-3 text-slate-700">{formatRupiah(bill.remaining)}</td>
                <td className="px-4 py-3 text-slate-700">{bill.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {bill.student_id ? (
                      <Link className="font-medium text-emerald-700" href={`/dashboard/spp/${bill.student_id}`}>Detail</Link>
                    ) : null}
                    {onEdit ? (
                      <Button type="button" variant="ghost" className="min-h-0 px-2 py-1 text-slate-700" onClick={() => onEdit(bill)}>Edit</Button>
                    ) : null}
                    {onDelete ? (
                      <Button type="button" variant="ghost" className="min-h-0 px-2 py-1 text-red-700 hover:bg-red-50" disabled={deletingId === bill.id} onClick={() => onDelete(bill)}>
                        {deletingId === bill.id ? "Menghapus..." : "Hapus"}
                      </Button>
                    ) : null}
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
