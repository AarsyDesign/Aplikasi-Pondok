import Link from "next/link";
import { SppSummaryCards } from "@/components/spp/SppSummaryCards";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        description="Ringkasan tagihan dan pembayaran SPP."
        title="SPP Santri"
      />
      <SppSummaryCards summary={summary} />
      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Menu Keuangan</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pilih pekerjaan SPP yang ingin dilakukan.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Button asChild variant="secondary"><Link href="/dashboard/spp/pengaturan">Pengaturan SPP</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/spp/generate">Generate Tagihan</Link></Button>
          <Button asChild><Link href="/dashboard/spp/tagihan">Kelola Tagihan SPP</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/spp/pembayaran">Input Pembayaran</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/spp/pengingat">Pengingat SPP</Link></Button>
          <Button asChild variant="secondary"><Link href="/dashboard/spp/rekap">Rekap Tunggakan</Link></Button>
        </div>
      </Card>
    </div>
  );
}
