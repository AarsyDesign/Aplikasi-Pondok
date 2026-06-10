import { formatRupiah, SppPayment } from "@/types/spp";

export function SppPaymentTable({ payments }: { payments: SppPayment[] }) {
  if (payments.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada riwayat pembayaran.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "Nama Santri", "Tanggal", "Nominal", "Metode", "Catatan"].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((payment, index) => (
              <tr key={payment.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{payment.studentName}</td>
                <td className="px-4 py-3 text-slate-700">{payment.payment_date}</td>
                <td className="px-4 py-3 text-slate-700">{formatRupiah(payment.amount_paid)}</td>
                <td className="px-4 py-3 text-slate-700">{payment.payment_method || "-"}</td>
                <td className="px-4 py-3 text-slate-700">{payment.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
