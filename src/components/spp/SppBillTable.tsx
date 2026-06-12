"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRupiah, getMonthName, getSppStatusLabel, SppBill } from "@/types/spp";

type SppBillTableProps = {
  bills: SppBill[];
  deletingId?: string;
  onDelete?: (bill: SppBill) => void;
  onEdit?: (bill: SppBill) => void;
};

export function SppBillTable({ bills, deletingId, onDelete, onEdit }: SppBillTableProps) {
  if (bills.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        Belum ada data tagihan SPP.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {["No", "Nama Santri", "Kelas / Marhalah", "Bulan", "Tahun", "Nominal", "Terbayar", "Sisa", "Status", "Aksi"].map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map((bill, index) => (
              <tr key={bill.id} className="transition hover:bg-emerald-50/40">
                <td className="px-4 py-3.5 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-950">{bill.studentName}</td>
                <td className="px-4 py-3.5 text-slate-700">{bill.className}</td>
                <td className="px-4 py-3.5 text-slate-700">{getMonthName(bill.bill_month)}</td>
                <td className="px-4 py-3.5 text-slate-700">{bill.bill_year}</td>
                <td className="px-4 py-3.5 font-medium text-slate-800">{formatRupiah(bill.amount)}</td>
                <td className="px-4 py-3.5 text-slate-700">{formatRupiah(bill.totalPaid)}</td>
                <td className="px-4 py-3.5 font-medium text-slate-800">{formatRupiah(bill.remaining)}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={bill.status}>{getSppStatusLabel(bill.status)}</StatusBadge>
                </td>
                <td className="px-4 py-3.5">
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
