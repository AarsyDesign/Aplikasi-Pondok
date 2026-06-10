"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { isValidWhatsAppNumber } from "@/lib/whatsapp";
import {
  formatRupiah,
  getMonthName,
  getSppStatusLabel,
  SppArrearsReportItem,
  SppBillStatus,
} from "@/types/spp";

type SppArrearsTableProps = {
  items: SppArrearsReportItem[];
  emptyMessage: string;
  onOpenWhatsApp: (item: SppArrearsReportItem) => void;
};

const statusClasses: Record<SppBillStatus, string> = {
  belum_bayar: "bg-red-50 text-red-700 ring-red-200",
  lunas: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  sebagian: "bg-amber-50 text-amber-700 ring-amber-200",
};

function canOpenWhatsApp(phone: string | null) {
  return Boolean(phone?.trim() && isValidWhatsAppNumber(phone));
}

export function SppArrearsTable({ emptyMessage, items, onOpenWhatsApp }: SppArrearsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                "No",
                "Nama Santri",
                "NIS",
                "Kelas / Marhalah",
                "Nama Wali",
                "Nomor Wali",
                "Bulan",
                "Tahun",
                "Nominal Tagihan",
                "Sudah Dibayar",
                "Sisa Tunggakan",
                "Status",
                "Aksi",
              ].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const hasWhatsApp = canOpenWhatsApp(item.guardianPhone);

              return (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-950">{item.studentName}</td>
                  <td className="px-4 py-3 text-slate-700">{item.nis ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{item.className}</td>
                  <td className="px-4 py-3 text-slate-700">{item.guardianName ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-700">
                    <div>{item.guardianPhone ?? "-"}</div>
                    {!item.guardianPhone?.trim() ? <div className="text-xs text-amber-700">Nomor wali belum tersedia.</div> : null}
                    {item.guardianPhone?.trim() && !hasWhatsApp ? <div className="text-xs text-amber-700">Nomor wali belum valid.</div> : null}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{getMonthName(item.bill_month)}</td>
                  <td className="px-4 py-3 text-slate-700">{item.bill_year}</td>
                  <td className="px-4 py-3 text-slate-700">{formatRupiah(item.amount)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatRupiah(item.totalPaid)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatRupiah(item.remaining)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClasses[item.status]}`}>
                      {getSppStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-44 flex-wrap gap-2">
                      {item.student_id ? (
                        <Link className="inline-flex min-h-8 items-center font-medium text-emerald-700" href={`/dashboard/spp/${item.student_id}`}>
                          Detail SPP
                        </Link>
                      ) : null}
                      <Button
                        type="button"
                        variant="secondary"
                        className="min-h-0 px-2 py-1"
                        disabled={!hasWhatsApp}
                        onClick={() => onOpenWhatsApp(item)}
                        title={hasWhatsApp ? "Buka WhatsApp" : "Nomor wali belum tersedia atau belum valid."}
                      >
                        Pengingat WhatsApp
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
