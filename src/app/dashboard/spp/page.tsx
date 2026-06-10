import Link from "next/link";
import { SppSummaryCards } from "@/components/spp/SppSummaryCards";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSppSummary } from "@/services/sppService";

export default async function SppPage() {
  const summary = await getSppSummary().catch(() => ({
    totalBillsThisMonth: 0,
    totalIncomeThisMonth: 0,
    totalPaidOff: 0,
    totalUnpaid: 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">SPP Santri</h1>
        <p className="mt-1 text-sm text-slate-600">Ringkasan tagihan dan pembayaran SPP.</p>
      </div>
      <SppSummaryCards summary={summary} />
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild><Link href="/dashboard/spp/tagihan">Kelola Tagihan SPP</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/spp/pembayaran">Input Pembayaran</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/spp/pengingat">Pengingat SPP</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/spp/rekap">Rekap Tunggakan</Link></Button>
        </div>
      </Card>
    </div>
  );
}
