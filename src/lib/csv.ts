import {
  getMonthName,
  getSppStatusLabel,
  SppArrearsCsvFilters,
  SppArrearsReportItem,
} from "@/types/spp";

type CsvValue = string | number | boolean | null | undefined;

function safeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function slugifyFilenamePart(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function escapeCsvValue(value: CsvValue) {
  const text = value === null || value === undefined ? "" : String(value);
  const escapedText = text.replace(/"/g, "\"\"");

  if (/[",\r\n]/.test(escapedText)) {
    return `"${escapedText}"`;
  }

  return escapedText;
}

export function arrayToCsv(rows: CsvValue[][]) {
  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

export function createSppArrearsCsvFilename(filters: SppArrearsCsvFilters) {
  const classPart = filters.className ? slugifyFilenamePart(filters.className) : "semua-kelas";
  const monthPart = filters.month ? slugifyFilenamePart(getMonthName(Number(filters.month))) : "semua-bulan";
  const yearPart = filters.year ? slugifyFilenamePart(filters.year) : "semua-tahun";

  return `rekap-spp-${classPart}-${monthPart}-${yearPart}.csv`;
}

export function exportSppArrearsToCsv(data: SppArrearsReportItem[], filters: SppArrearsCsvFilters) {
  const header = [
    "No",
    "Nama Santri",
    "NIS",
    "Kelas / Marhalah",
    "Nama Wali",
    "Nomor Wali",
    "Bulan",
    "Tahun",
    "Nominal Tagihan",
    "Sudah Dibayar",
    "Sisa Tunggakan",
    "Status",
  ];

  const rows = data.map<CsvValue[]>((item, index) => [
    index + 1,
    item.studentName,
    item.nis ?? "",
    item.className,
    item.guardianName ?? "",
    item.guardianPhone ?? "",
    getMonthName(item.bill_month),
    item.bill_year,
    safeNumber(item.amount),
    safeNumber(item.totalPaid),
    safeNumber(item.remaining),
    getSppStatusLabel(item.status),
  ]);

  downloadCsv(createSppArrearsCsvFilename(filters), arrayToCsv([header, ...rows]));
}
