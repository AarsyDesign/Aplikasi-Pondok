import Link from "next/link";
import { SppBillTable } from "@/components/spp/SppBillTable";
import { SppPaymentTable } from "@/components/spp/SppPaymentTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSppBillsByStudent, getSppPaymentsByStudent } from "@/services/sppService";
import { getStudentById } from "@/services/studentService";
import { formatRupiah } from "@/types/spp";

export default async function SppStudentPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [student, bills, payments] = await Promise.all([
    getStudentById(studentId).catch(() => undefined),
    getSppBillsByStudent(studentId).catch(() => []),
    getSppPaymentsByStudent(studentId).catch(() => []),
  ]);

  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount_paid, 0);
  const totalRemaining = Math.max(totalBills - totalPaid, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Detail SPP Santri</h1>
          <p className="mt-1 text-sm text-slate-600">Tagihan dan riwayat pembayaran satu santri.</p>
        </div>
        <Button asChild variant="secondary"><Link href="/dashboard/spp/tagihan">Kembali</Link></Button>
      </div>
      <Card>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div><dt className="text-sm text-slate-500">Nama Santri</dt><dd className="font-semibold">{student?.full_name ?? "-"}</dd></div>
          <div><dt className="text-sm text-slate-500">NIS</dt><dd className="font-semibold">{student?.nis ?? "-"}</dd></div>
          <div><dt className="text-sm text-slate-500">Kelas / Marhalah</dt><dd className="font-semibold">{student?.className ?? "-"}</dd></div>
          <div><dt className="text-sm text-slate-500">Nama Wali</dt><dd className="font-semibold">{student?.guardian_name ?? "-"}</dd></div>
          <div><dt className="text-sm text-slate-500">Nomor Wali</dt><dd className="font-semibold">{student?.guardian_phone ?? "-"}</dd></div>
        </dl>
      </Card>
      <section className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Total tagihan</p><p className="mt-2 text-2xl font-bold">{formatRupiah(totalBills)}</p></Card>
        <Card><p className="text-sm text-slate-500">Total sudah dibayar</p><p className="mt-2 text-2xl font-bold">{formatRupiah(totalPaid)}</p></Card>
        <Card><p className="text-sm text-slate-500">Total tunggakan</p><p className="mt-2 text-2xl font-bold">{formatRupiah(totalRemaining)}</p></Card>
      </section>
      <div>
        <h2 className="mb-3 text-lg font-semibold">Daftar Tagihan</h2>
        <SppBillTable bills={bills} />
      </div>
      <div>
        <h2 className="mb-3 text-lg font-semibold">Riwayat Pembayaran</h2>
        <SppPaymentTable payments={payments} />
      </div>
    </div>
  );
}
