"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ClassGroup } from "@/types/class";
import { Student, StudentFormData, StudentStatus } from "@/types/student";

type SantriFormProps = {
  classes: ClassGroup[];
  initialData?: Student;
  submitLabel?: string;
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
};

const statusOptions: Array<{ label: string; value: StudentStatus }> = [
  { label: "aktif", value: "aktif" },
  { label: "nonaktif", value: "nonaktif" },
  { label: "lulus", value: "lulus" },
  { label: "pindah", value: "pindah" },
];

function getInitialFormData(student?: Student): StudentFormData {
  return {
    nis: student?.nis ?? "",
    full_name: student?.full_name ?? "",
    gender: student?.gender ?? "",
    birth_place: student?.birth_place ?? "",
    birth_date: student?.birth_date ?? "",
    guardian_name: student?.guardian_name ?? "",
    guardian_phone: student?.guardian_phone ?? "",
    address: student?.address ?? "",
    class_id: student?.class_id ?? "",
    status: student?.status ?? "aktif",
  };
}

export function SantriForm({
  classes,
  initialData,
  submitLabel = "Simpan",
  isSaving = false,
  onCancel,
  onSubmit,
}: SantriFormProps) {
  const [formData, setFormData] = useState<StudentFormData>(() =>
    getInitialFormData(initialData),
  );
  const [validationError, setValidationError] = useState("");

  const classOptions = useMemo(
    () => [
      { label: "Tanpa kelas", value: "" },
      ...classes.map((classGroup) => ({
        label: classGroup.name,
        value: classGroup.id,
      })),
    ],
    [classes],
  );

  function updateField(name: keyof StudentFormData, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (!formData.full_name.trim()) {
      setValidationError("Nama Lengkap wajib diisi.");
      return;
    }

    if (!formData.status) {
      setValidationError("Status wajib dipilih.");
      return;
    }

    await onSubmit(formData);
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      {validationError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {validationError}
        </div>
      ) : null}

      <Input
        label="NIS"
        placeholder="2026001"
        value={formData.nis}
        onChange={(event) => updateField("nis", event.target.value)}
      />
      <Input
        label="Nama Lengkap"
        placeholder="Ahmad Fauzan"
        value={formData.full_name}
        onChange={(event) => updateField("full_name", event.target.value)}
        required
      />
      <Select
        label="Jenis Kelamin"
        value={formData.gender}
        onChange={(event) => updateField("gender", event.target.value)}
        options={[
          { label: "Pilih jenis kelamin", value: "" },
          { label: "laki-laki", value: "laki-laki" },
          { label: "perempuan", value: "perempuan" },
        ]}
      />
      <Input
        label="Tempat Lahir"
        placeholder="Bandung"
        value={formData.birth_place}
        onChange={(event) => updateField("birth_place", event.target.value)}
      />
      <Input
        label="Tanggal Lahir"
        type="date"
        value={formData.birth_date}
        onChange={(event) => updateField("birth_date", event.target.value)}
      />
      <Input
        label="Nama Wali"
        placeholder="Bapak Abdullah"
        value={formData.guardian_name}
        onChange={(event) => updateField("guardian_name", event.target.value)}
      />
      <Input
        label="Nomor Wali"
        placeholder="08123456789"
        value={formData.guardian_phone}
        onChange={(event) => updateField("guardian_phone", event.target.value)}
      />
      <Select
        label="Kelas / Marhalah"
        value={formData.class_id}
        onChange={(event) => updateField("class_id", event.target.value)}
        options={classOptions}
      />
      <Select
        label="Status"
        value={formData.status}
        onChange={(event) => updateField("status", event.target.value)}
        options={statusOptions}
        required
      />
      <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
        Alamat
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          placeholder="Alamat lengkap santri"
          value={formData.address}
          onChange={(event) => updateField("address", event.target.value)}
        />
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
            Batal
          </Button>
        ) : null}
      </div>
    </form>
  );
}
