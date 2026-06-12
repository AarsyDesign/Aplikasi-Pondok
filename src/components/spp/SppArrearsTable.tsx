"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { isValidWhatsAppNumber } from "@/lib/whatsapp";
import {
  formatRupiah,
  getMonthName,
  getSppStatusLabel,
  SppArrearsReportItem,
} from "@/types/spp";

type SppArrearsTableProps = {
  items: SppArrearsReportItem[];
  emptyMessage: string;
  onOpenWhatsApp: (item: SppArrearsReportItem) => void;
};

function canOpenWhatsApp(phone: string | null) {
  return Boolean(phone?.trim() && isValidWhatsAppNumber(phone));
}

export function SppArrearsTable({ emptyMessage, items, onOpenWhatsApp }: SppArrearsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
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
                <th key={header} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const hasWhatsApp = canOpenWhatsApp(item.guardianPhone);

              return (
                <tr key={item.id} className="transition hover:bg-emerald-50/40">
                  <td className="px-4 py-3.5 text-slate-600">{index + 1}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-950">{item.studentName}</td>
                  <td className="px-4 py-3.5 text-slate-700">{item.nis ?? "-"}</td>
                  <td className="px-4 py-3.5 text-slate-700">{item.className}</td>
                  <td className="px-4 py-3.5 text-slate-700">{item.guardianName ?? "-"}</td>
                  <td className="px-4 py-3.5 text-slate-700">
                    <div>{item.guardianPhone ?? "-"}</div>
                    {!item.guardianPhone?.trim() ? <div className="text-xs text-amber-700">Nomor wali belum tersedia.</div> : null}
                    {item.guardianPhone?.trim() && !hasWhatsApp ? <div className="text-xs text-amber-700">Nomor wali belum valid.</div> : null}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{getMonthName(item.bill_month)}</td>
                  <td className="px-4 py-3.5 text-slate-700">{item.bill_year}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{formatRupiah(item.amount)}</td>
                  <td className="px-4 py-3.5 text-slate-700">{formatRupiah(item.totalPaid)}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">{formatRupiah(item.remaining)}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={item.status}>{getSppStatusLabel(item.status)}</StatusBadge>
                  </td>
                  <td className="px-4 py-3.5">
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
