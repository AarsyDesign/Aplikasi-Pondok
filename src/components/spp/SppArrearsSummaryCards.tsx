import { Card } from "@/components/ui/Card";
import { formatRupiah, SppArrearsSummary } from "@/types/spp";

type SppArrearsSummaryCardsProps = {
  summary: SppArrearsSummary;
};

export function SppArrearsSummaryCards({ summary }: SppArrearsSummaryCardsProps) {
  const items = [
    { label: "Total Tagihan", value: formatRupiah(summary.totalBillsAmount) },
    { label: "Total Dibayar", value: formatRupiah(summary.totalPaidAmount) },
    { label: "Total Tunggakan", value: formatRupiah(summary.totalRemainingAmount) },
    { label: "Santri Lunas", value: summary.totalPaidOff },
    { label: "Bayar Sebagian", value: summary.totalPartial },
    { label: "Belum Bayar", value: summary.totalUnpaid },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-slate-600">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
