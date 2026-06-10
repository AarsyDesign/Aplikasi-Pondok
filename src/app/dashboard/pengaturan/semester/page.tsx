"use client";

import { useEffect, useMemo, useState } from "react";
import { SemesterForm } from "@/components/pengaturan/SemesterForm";
import { SemesterTable } from "@/components/pengaturan/SemesterTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { getAcademicYears } from "@/services/academicYearService";
import {
  activateSemester,
  createSemester,
  deleteSemester,
  getSemesters,
  updateSemester,
} from "@/services/semesterService";
import { AcademicYear } from "@/types/academicYear";
import { Semester, SemesterFormData } from "@/types/semester";

export default function SemesterPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [academicYearFilter, setAcademicYearFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activatingId, setActivatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadData() {
    setIsLoading(true);
    Promise.all([getAcademicYears(), getSemesters()])
      .then(([yearData, semesterData]) => {
        setAcademicYears(yearData);
        setSemesters(semesterData);
        setAcademicYearFilter((current) => current || yearData.find((year) => year.is_active)?.id || yearData[0]?.id || "");
      })
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Gagal memuat semester."))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let active = true;
    Promise.all([getAcademicYears(), getSemesters()])
      .then(([yearData, semesterData]) => {
        if (!active) return;
        setAcademicYears(yearData);
        setSemesters(semesterData);
        setAcademicYearFilter(yearData.find((year) => year.is_active)?.id || yearData[0]?.id || "");
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Gagal memuat semester.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredSemesters = useMemo(() => {
    if (!academicYearFilter) return semesters;
    return semesters.filter((semester) => semester.academic_year_id === academicYearFilter);
  }, [academicYearFilter, semesters]);

  async function handleSubmit(data: SemesterFormData) {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      if (selectedSemester) {
        await updateSemester(selectedSemester.id, data);
        setSuccess("Semester berhasil diperbarui.");
      } else {
        await createSemester(data);
        setSuccess("Semester berhasil ditambahkan.");
      }

      setAcademicYearFilter(data.academic_year_id);
      setSelectedSemester(null);
      setShowForm(false);
      loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan semester.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleActivate(semester: Semester) {
    if (!semester.academic_year_id) {
      setError("Semester belum memiliki tahun ajaran.");
      return;
    }

    try {
      setActivatingId(semester.id);
      setError("");
      setSuccess("");
      await activateSemester(semester.id, semester.academic_year_id);
      setSuccess(`${semester.name} berhasil diaktifkan.`);
      loadData();
    } catch (activateError) {
      setError(activateError instanceof Error ? activateError.message : "Gagal mengaktifkan semester.");
    } finally {
      setActivatingId("");
    }
  }

  async function handleDelete(semester: Semester) {
    if (!window.confirm(`Hapus ${semester.name}?`)) return;

    try {
      setDeletingId(semester.id);
      setError("");
      setSuccess("");
      await deleteSemester(semester.id);
      setSuccess("Semester berhasil dihapus.");
      loadData();
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
          <h1 className="text-2xl font-bold text-slate-950">Semester</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola semester pada setiap tahun ajaran.</p>
        </div>
        <Button type="button" onClick={() => { setSelectedSemester(null); setShowForm(true); }}>
          Tambah Semester
        </Button>
      </div>

      <Card>
        <Select
          label="Filter Tahun Ajaran"
          value={academicYearFilter}
          onChange={(event) => setAcademicYearFilter(event.target.value)}
          options={[
            { label: "Semua tahun ajaran", value: "" },
            ...academicYears.map((year) => ({ label: year.name, value: year.id })),
          ]}
        />
      </Card>

      {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div> : null}

      {showForm ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{selectedSemester ? "Edit Semester" : "Tambah Semester"}</h2>
          <SemesterForm
            key={selectedSemester?.id ?? `new-semester-${academicYearFilter}`}
            academicYears={academicYears}
            initialAcademicYearId={academicYearFilter}
            initialData={selectedSemester}
            isSaving={isSaving}
            onCancel={() => { setSelectedSemester(null); setShowForm(false); }}
            onSubmit={handleSubmit}
          />
        </Card>
      ) : null}

      {isLoading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">Memuat semester...</div>
      ) : (
        <SemesterTable
          activatingId={activatingId}
          deletingId={deletingId}
          semesters={filteredSemesters}
          onActivate={handleActivate}
          onDelete={handleDelete}
          onEdit={(semester) => { setSelectedSemester(semester); setShowForm(true); }}
        />
      )}
    </div>
  );
}
