"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AcademicYear } from "@/types/academicYear";
import { Semester, SemesterFormData } from "@/types/semester";

type SemesterFormProps = {
  academicYears: AcademicYear[];
  initialAcademicYearId?: string;
  initialData?: Semester | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (data: SemesterFormData) => void;
};

export function SemesterForm({
  academicYears,
  initialAcademicYearId,
  initialData,
  isSaving,
  onCancel,
  onSubmit,
}: SemesterFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [academicYearId, setAcademicYearId] = useState(
    initialData?.academic_year_id ?? initialAcademicYearId ?? "",
  );
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setError("Nama semester wajib diisi.");
      return;
    }

    if (!academicYearId) {
      setError("Tahun ajaran wajib dipilih.");
      return;
    }

    setError("");
    onSubmit({ academic_year_id: academicYearId, name: cleanName });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Semester"
        placeholder="Contoh: Semester 1"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Select
        label="Tahun Ajaran"
        value={academicYearId}
        onChange={(event) => setAcademicYearId(event.target.value)}
        options={[
          { label: "Pilih tahun ajaran", value: "" },
          ...academicYears.map((year) => ({ label: year.name, value: year.id })),
        ]}
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
