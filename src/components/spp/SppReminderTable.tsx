"use client";

import { Button } from "@/components/ui/Button";
import { isValidWhatsAppNumber } from "@/lib/whatsapp";
import { formatRupiah, getMonthName, SppReminderData } from "@/types/spp";

type SppReminderTableProps = {
  reminders: SppReminderData[];
  onCopy: (reminder: SppReminderData) => void;
  onOpenMessage: (reminder: SppReminderData) => void;
  onOpenWhatsApp: (reminder: SppReminderData) => void;
};

function getPhoneStatus(phone: string | null) {
  if (!phone?.trim()) return "Nomor wali belum tersedia.";
  if (!isValidWhatsAppNumber(phone)) return "Nomor wali belum valid.";
  return "Tersedia";
}

export function SppReminderTable({
  reminders,
  onCopy,
  onOpenMessage,
  onOpenWhatsApp,
}: SppReminderTableProps) {
  if (reminders.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Tidak ada tagihan SPP yang perlu diingatkan.
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
                "Kelas / Marhalah",
                "Nama Wali",
                "Nomor Wali",
                "Bulan",
                "Tahun",
                "Nominal Tagihan",
                "Sudah Dibayar",
                "Sisa Tagihan",
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
            {reminders.map((reminder, index) => {
              const phoneStatus = getPhoneStatus(reminder.guardianPhone);
              const canOpenWhatsApp = phoneStatus === "Tersedia";

              return (
                <tr key={reminder.id}>
                  <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-950">{reminder.studentName}</td>
                  <td className="px-4 py-3 text-slate-700">{reminder.className}</td>
                  <td className="px-4 py-3 text-slate-700">{reminder.guardianName ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-700">
                    <div>{reminder.guardianPhone ?? "-"}</div>
                    <div className={canOpenWhatsApp ? "text-xs text-emerald-700" : "text-xs text-amber-700"}>
                      {phoneStatus}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{getMonthName(reminder.bill_month)}</td>
                  <td className="px-4 py-3 text-slate-700">{reminder.bill_year}</td>
                  <td className="px-4 py-3 text-slate-700">{formatRupiah(reminder.amount)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatRupiah(reminder.totalPaid)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatRupiah(reminder.remaining)}</td>
                  <td className="px-4 py-3 text-slate-700">{reminder.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-48 flex-wrap gap-2">
                      <Button type="button" variant="ghost" className="min-h-0 px-2 py-1" onClick={() => onOpenMessage(reminder)}>
                        Lihat Pesan
                      </Button>
                      <Button type="button" variant="ghost" className="min-h-0 px-2 py-1" onClick={() => onCopy(reminder)}>
                        Salin Pesan
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="min-h-0 px-2 py-1"
                        disabled={!canOpenWhatsApp}
                        onClick={() => onOpenWhatsApp(reminder)}
                        title={canOpenWhatsApp ? "Buka WhatsApp" : phoneStatus}
                      >
                        Kirim WhatsApp
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
