"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { ClassGroup } from "@/types/class";
import type { ResidenceType } from "@/types/student";
import { getMonthName, SppBillStatus } from "@/types/spp";

type SppArrearsFiltersProps = {
  classes: ClassGroup[];
  classFilter: string;
  monthFilter: string;
  yearFilter: string;
  statusFilter: SppBillStatus | "";
  residenceTypeFilter: ResidenceType | "";
  onClassChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onStatusChange: (value: SppBillStatus | "") => void;
  onResidenceTypeChange: (value: ResidenceType | "") => void;
  onApply: () => void;
};

export function SppArrearsFilters({
  classes,
  classFilter,
  monthFilter,
  yearFilter,
  statusFilter,
  residenceTypeFilter,
  onApply,
  onClassChange,
  onMonthChange,
  onStatusChange,
  onResidenceTypeChange,
  onYearChange,
}: SppArrearsFiltersProps) {
  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    label: getMonthName(index + 1),
    value: String(index + 1),
  }));

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Select
          label="Kelas / Marhalah"
          value={classFilter}
          onChange={(event) => onClassChange(event.target.value)}
          options={[{ label: "Semua kelas", value: "" }, ...classes.map((item) => ({ label: item.name, value: item.id }))]}
        />
        <Select
          label="Bulan"
          value={monthFilter}
          onChange={(event) => onMonthChange(event.target.value)}
          options={[{ label: "Semua bulan", value: "" }, ...monthOptions]}
        />
        <label className="block text-sm font-medium text-slate-700">
          Tahun
          <input
            className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            value={yearFilter}
            onChange={(event) => onYearChange(event.target.value)}
          />
        </label>
        <Select
          label="Status"
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value as SppBillStatus | "")}
          options={[
            { label: "Semua", value: "" },
            { label: "Belum Bayar", value: "belum_bayar" },
            { label: "Sebagian", value: "sebagian" },
            { label: "Lunas", value: "lunas" },
          ]}
        />
        <Select
          label="Status Santri"
          value={residenceTypeFilter}
          onChange={(event) => onResidenceTypeChange(event.target.value as ResidenceType | "")}
          options={[
            { label: "Semua", value: "" },
            { label: "Mukim", value: "mukim" },
            { label: "Non Mukim", value: "non_mukim" },
          ]}
        />
        <div className="flex items-end">
          <Button type="button" variant="secondary" onClick={onApply}>
            Terapkan Filter
          </Button>
        </div>
      </div>
    </Card>
  );
}
