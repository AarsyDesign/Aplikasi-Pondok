"use client";

import { useEffect, useState } from "react";
import { ExportCsvButton } from "@/components/spp/ExportCsvButton";
import { SppArrearsFilters } from "@/components/spp/SppArrearsFilters";
import { SppArrearsSummaryCards } from "@/components/spp/SppArrearsSummaryCards";
import { SppArrearsTable } from "@/components/spp/SppArrearsTable";
import { createSppReminderMessage, createWhatsAppUrl, isValidWhatsAppNumber } from "@/lib/whatsapp";
import { getClasses } from "@/services/classService";
import { getSppArrearsReport, getSppArrearsSummary } from "@/services/sppService";
import { ClassGroup } from "@/types/class";
import { SppArrearsReportItem, SppArrearsSummary, SppBillStatus } from "@/types/spp";

const initialDate = new Date();
const initialMonth = String(initialDate.getMonth() + 1);
const initialYear = String(initialDate.getFullYear());

const emptySummary: SppArrearsSummary = {
  totalBillsAmount: 0,
  totalPaidAmount: 0,
  totalPaidOff: 0,
  totalPartial: 0,
  totalRemainingAmount: 0,
  totalStudentsInReport: 0,
  totalUnpaid: 0,
};

export default function SppArrearsReportPage() {
  const [items, setItems] = useState<SppArrearsReportItem[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [summary, setSummary] = useState<SppArrearsSummary>(emptySummary);
  const [classFilter, setClassFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(initialMonth);
  const [yearFilter, setYearFilter] = useState(initialYear);
  const [statusFilter, setStatusFilter] = useState<SppBillStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  function getBaseFilters() {
    return { classId: classFilter, month: monthFilter, year: yearFilter };
  }

  function loadReport() {
    setIsLoading(true);
    setError("");
    setExportMessage("");
    const baseFilters = getBaseFilters();

    Promise.all([
      getSppArrearsSummary(baseFilters),
      getSppArrearsReport({ ...baseFilters, status: statusFilter }),
    ])
      .then(([summaryData, reportData]) => {
        setSummary(summaryData);
        setItems(reportData);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat rekap tunggakan SPP.");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      getClasses(),
      getSppArrearsSummary({ month: initialMonth, year: initialYear }),
      getSppArrearsReport({ month: initialMonth, year: initialYear }),
    ])
      .then(([classData, summaryData, reportData]) => {
        if (!active) return;
        setClasses(classData);
        setSummary(summaryData);
        setItems(reportData);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Gagal memuat rekap tunggakan SPP.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleOpenWhatsApp(item: SppArrearsReportItem) {
    if (!item.guardianPhone?.trim()) {
      setError("Nomor wali belum tersedia.");
      return;
    }

    if (!isValidWhatsAppNumber(item.guardianPhone)) {
      setError("Nomor wali belum valid.");
      return;
    }

    window.open(createWhatsAppUrl(item.guardianPhone, createSppReminderMessage(item)), "_blank", "noopener,noreferrer");
  }

  function handleEmptyExport() {
    setExportMessage("Tidak ada data untuk diekspor.");
  }

  const selectedClass = classes.find((item) => item.id === classFilter);

  const hasBillsInPeriod =
    summary.totalStudentsInReport > 0 ||
    summary.totalBillsAmount > 0 ||
    summary.totalPaidAmount > 0 ||
    summary.totalRemainingAmount > 0;
  const hasArrears = summary.totalUnpaid + summary.totalPartial > 0;
  const emptyMessage = !hasBillsInPeriod
    ? "Belum ada data tagihan SPP untuk periode ini."
    : !hasArrears && statusFilter !== "lunas"
      ? "Tidak ada tunggakan SPP untuk periode ini."
      : "Belum ada data tagihan SPP untuk periode ini.";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Rekap Tunggakan SPP</h1>
        <p className="mt-1 text-sm text-slate-600">Pantau tunggakan SPP berdasarkan kelas, bulan, tahun, dan status.</p>
      </div>

      <SppArrearsFilters
        classes={classes}
        classFilter={classFilter}
        monthFilter={monthFilter}
        yearFilter={yearFilter}
        statusFilter={statusFilter}
        onApply={loadReport}
        onClassChange={setClassFilter}
        onMonthChange={setMonthFilter}
        onStatusChange={setStatusFilter}
        onYearChange={setYearFilter}
      />

      {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <SppArrearsSummaryCards summary={summary} />

      <div className="flex flex-col justify-between gap-3 rounded-md border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Data Rekap</h2>
          <p className="mt-1 text-sm text-slate-600">Export data sesuai filter yang sedang tampil.</p>
          {items.length === 0 ? <p className="mt-1 text-sm text-amber-700">Tidak ada data untuk diekspor.</p> : null}
          {exportMessage ? <p className="mt-1 text-sm text-amber-700">{exportMessage}</p> : null}
        </div>
        <ExportCsvButton
          data={items}
          disabled={isLoading || items.length === 0}
          filters={{
            classId: classFilter,
            className: selectedClass?.name,
            month: monthFilter,
            status: statusFilter,
            year: yearFilter,
          }}
          onEmptyData={handleEmptyExport}
        />
      </div>

      {isLoading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">Memuat rekap tunggakan SPP...</div>
      ) : (
        <SppArrearsTable items={items} emptyMessage={emptyMessage} onOpenWhatsApp={handleOpenWhatsApp} />
      )}
    </div>
  );
}
