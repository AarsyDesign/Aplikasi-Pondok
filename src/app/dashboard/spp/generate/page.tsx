"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatResidenceType } from "@/lib/utils";
import { getAcademicYears } from "@/services/academicYearService";
import { generateMonthlySppBills, previewMonthlySppBills } from "@/services/sppService";
import { AcademicYear } from "@/types/academicYear";
import { formatRupiah, getMonthName, SppGeneratePreviewItem } from "@/types/spp";

const now = new Date();

function getPreviewStatusLabel(status: SppGeneratePreviewItem["status"]) {
  if (status === "akan_dibuat") return "Akan Dibuat";
  if (status === "sudah_ada") return "Sudah Ada";
  return "Nominal Belum Diatur";
}

export default function SppGeneratePage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [academicYearId, setAcademicYearId] = useState("");
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [previewItems, setPreviewItems] = useState<SppGeneratePreviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => ({ label: getMonthName(index + 1), value: String(index + 1) })),
    [],
  );

  useEffect(() => {
    getAcademicYears()
      .then((data) => {
        setAcademicYears(data);
        setAcademicYearId(data.find((item) => item.is_active)?.id ?? data[0]?.id ?? "");
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat tahun ajaran.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function handlePreview() {
    try {
      setIsPreviewing(true);
      setMessage("");
      setError("");

      if (!academicYearId) {
        setError("Tahun ajaran wajib dipilih.");
        return;
      }

      const data = await previewMonthlySppBills(Number(month), Number(year), academicYearId);
      setPreviewItems(data);
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : "Gagal membuat preview tagihan.");
    } finally {
      setIsPreviewing(false);
    }
  }

  async function handleGenerate() {
    try {
      setIsGenerating(true);
      setMessage("");
      setError("");
      const result = await generateMonthlySppBills(Number(month), Number(year), academicYearId);
      setMessage(`Generate selesai. Dibuat: ${result.created}. Sudah ada: ${result.skippedExisting}. Nominal belum diatur: ${result.skippedWithoutAmount}.`);
      const data = await previewMonthlySppBills(Number(month), Number(year), academicYearId);
      setPreviewItems(data);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "Gagal generate tagihan SPP.");
    } finally {
      setIsGenerating(false);
    }
  }

  const canGenerate = previewItems.some((item) => item.status === "akan_dibuat");

  return (
    <div className="space-y-6">
      <PageHeader
        description="Generate tagihan bulanan berdasarkan status santri mukim/non mukim dan pengaturan SPP aktif."
        title="Generate Tagihan SPP"
      />

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {message ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}

      <Card>
        {isLoading ? (
          <LoadingState message="Memuat pilihan tahun ajaran..." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Tahun Ajaran"
              value={academicYearId}
              onChange={(event) => setAcademicYearId(event.target.value)}
              options={[{ label: "Pilih tahun ajaran", value: "" }, ...academicYears.map((item) => ({ label: item.name, value: item.id }))]}
            />
            <Select label="Bulan" value={month} onChange={(event) => setMonth(event.target.value)} options={monthOptions} />
            <label className="block text-sm font-semibold text-slate-700">
              Tahun
              <input className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" value={year} onChange={(event) => setYear(event.target.value)} />
            </label>
            <div className="flex flex-col gap-3 sm:col-span-3 sm:flex-row">
              <Button type="button" variant="secondary" disabled={isPreviewing} onClick={handlePreview}>{isPreviewing ? "Memuat Preview..." : "Preview"}</Button>
              <Button type="button" disabled={!canGenerate || isGenerating} onClick={handleGenerate}>{isGenerating ? "Generate..." : "Generate Tagihan"}</Button>
            </div>
          </div>
        )}
      </Card>

      {previewItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Preview tagihan belum dibuat.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Nama Santri", "NIS", "Kelas / Marhalah", "Status Santri", "Nominal SPP", "Tanggal Tagihan", "Status", "Keterangan"].map((header) => (
                    <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewItems.map((item) => (
                  <tr key={item.student_id}>
                    <td className="px-4 py-3 font-medium text-slate-950">{item.studentName}</td>
                    <td className="px-4 py-3 text-slate-700">{item.nis ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-700">{item.className}</td>
                    <td className="px-4 py-3 text-slate-700">{formatResidenceType(item.residence_type)}</td>
                    <td className="px-4 py-3 font-medium text-slate-950">{item.amount === null ? "-" : formatRupiah(item.amount)}</td>
                    <td className="px-4 py-3 text-slate-700">{item.due_date ?? "-"}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status === "akan_dibuat" ? "aktif" : item.status === "sudah_ada" ? "sebagian" : "belum_bayar"}>{getPreviewStatusLabel(item.status)}</StatusBadge></td>
                    <td className="px-4 py-3 text-slate-700">{item.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
