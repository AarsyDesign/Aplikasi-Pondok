import { Card } from "@/components/ui/Card";
import { formatRupiah, SppSummary } from "@/types/spp";

export function SppSummaryCards({ summary }: { summary: SppSummary }) {
  const items = [
    ["Total tagihan bulan ini", summary.totalBillsThisMonth],
    ["Total sudah lunas", summary.totalPaidOff],
    ["Total belum bayar", summary.totalUnpaid],
    ["Total pemasukan bulan ini", formatRupiah(summary.totalIncomeThisMonth)],
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <Card key={label}>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        </Card>
      ))}
    </section>
  );
}
