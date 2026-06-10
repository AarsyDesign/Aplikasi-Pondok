"use client";

import { useEffect, useState } from "react";
import { AcademicYearForm } from "@/components/pengaturan/AcademicYearForm";
import { AcademicYearTable } from "@/components/pengaturan/AcademicYearTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  activateAcademicYear,
  createAcademicYear,
  deleteAcademicYear,
  getAcademicYears,
  updateAcademicYear,
} from "@/services/academicYearService";
import { AcademicYear, AcademicYearFormData } from "@/types/academicYear";

export default function AcademicYearPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activatingId, setActivatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadAcademicYears() {
    setIsLoading(true);
    getAcademicYears()
      .then(setAcademicYears)
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Gagal memuat tahun ajaran."))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let active = true;
    getAcademicYears()
      .then((data) => {
        if (active) setAcademicYears(data);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Gagal memuat tahun ajaran.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(data: AcademicYearFormData) {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      if (selectedYear) {
        await updateAcademicYear(selectedYear.id, data);
        setSuccess("Tahun ajaran berhasil diperbarui.");
      } else {
        await createAcademicYear(data);
        setSuccess("Tahun ajaran berhasil ditambahkan.");
      }

      setSelectedYear(null);
      setShowForm(false);
      loadAcademicYears();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan tahun ajaran.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleActivate(academicYear: AcademicYear) {
    try {
      setActivatingId(academicYear.id);
      setError("");
      setSuccess("");
      await activateAcademicYear(academicYear.id);
      setSuccess(`${academicYear.name} berhasil diaktifkan.`);
      loadAcademicYears();
    } catch (activateError) {
      setError(activateError instanceof Error ? activateError.message : "Gagal mengaktifkan tahun ajaran.");
    } finally {
      setActivatingId("");
    }
  }

  async function handleDelete(academicYear: AcademicYear) {
    if (!window.confirm(`Hapus tahun ajaran ${academicYear.name}?`)) return;

    try {
      setDeletingId(academicYear.id);
      setError("");
      setSuccess("");
      await deleteAcademicYear(academicYear.id);
      setSuccess("Tahun ajaran berhasil dihapus.");
      loadAcademicYears();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Data tidak bisa dihapus karena masih digunakan oleh data lain.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Tahun Ajaran</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola tahun ajaran aktif untuk nilai, raport, dan SPP.</p>
        </div>
        <Button type="button" onClick={() => { setSelectedYear(null); setShowForm(true); }}>
          Tambah Tahun Ajaran
        </Button>
      </div>

      {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div> : null}

      {showForm ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{selectedYear ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"}</h2>
          <AcademicYearForm
            key={selectedYear?.id ?? "new-academic-year"}
            initialData={selectedYear}
            isSaving={isSaving}
            onCancel={() => { setSelectedYear(null); setShowForm(false); }}
            onSubmit={handleSubmit}
          />
        </Card>
      ) : null}

      {isLoading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">Memuat tahun ajaran...</div>
      ) : (
        <AcademicYearTable
          academicYears={academicYears}
          activatingId={activatingId}
          deletingId={deletingId}
          onActivate={handleActivate}
          onDelete={handleDelete}
          onEdit={(academicYear) => { setSelectedYear(academicYear); setShowForm(true); }}
        />
      )}
    </div>
  );
}
