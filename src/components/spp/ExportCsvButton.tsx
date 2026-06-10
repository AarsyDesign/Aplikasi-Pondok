"use client";

import { Button } from "@/components/ui/Button";
import { exportSppArrearsToCsv } from "@/lib/csv";
import { SppArrearsCsvFilters, SppArrearsReportItem } from "@/types/spp";

type ExportCsvButtonProps = {
  data: SppArrearsReportItem[];
  disabled?: boolean;
  filters: SppArrearsCsvFilters;
  onEmptyData: () => void;
};

export function ExportCsvButton({ data, disabled, filters, onEmptyData }: ExportCsvButtonProps) {
  function handleExport() {
    if (data.length === 0) {
      onEmptyData();
      return;
    }

    exportSppArrearsToCsv(data, filters);
  }

  return (
    <Button type="button" variant="secondary" disabled={disabled} onClick={handleExport}>
      Export CSV
    </Button>
  );
}
