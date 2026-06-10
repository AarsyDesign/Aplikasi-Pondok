"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AcademicYear, AcademicYearFormData } from "@/types/academicYear";

type AcademicYearFormProps = {
  initialData?: AcademicYear | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (data: AcademicYearFormData) => void;
};

export function AcademicYearForm({ initialData, isSaving, onCancel, onSubmit }: AcademicYearFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setError("Tahun ajaran wajib diisi.");
      return;
    }

    if (cleanName.length < 4) {
      setError("Tahun ajaran minimal 4 karakter.");
      return;
    }

    setError("");
    onSubmit({ name: cleanName });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Tahun Ajaran"
        placeholder="Contoh: 2026/2027"
        value={name}
        onChange={(event) => setName(event.target.value)}
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
