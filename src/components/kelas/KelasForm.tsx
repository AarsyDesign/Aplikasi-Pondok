"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ClassFormData, ClassGroup } from "@/types/class";

type KelasFormProps = {
  initialData?: ClassGroup | null;
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit: (data: ClassFormData) => Promise<void>;
};

const emptyForm: ClassFormData = {
  name: "",
  level: "",
  description: "",
};

const standardClassOptions = [
  ...Array.from({ length: 6 }, (_, index) => ({
    description: "Setara SD",
    label: `Ta'sisiyah Dasar ${index + 1}`,
    level: String(index + 1),
    name: `Ta'sisiyah Dasar ${index + 1}`,
    value: `tasisiyah-dasar-${index + 1}`,
  })),
  ...Array.from({ length: 3 }, (_, index) => ({
    description: "Setara SMP",
    label: `Marhalah Tarbiyatul Fityan ${index + 1}`,
    level: String(index + 1),
    name: `Marhalah Tarbiyatul Fityan ${index + 1}`,
    value: `tarbiyatul-fityan-${index + 1}`,
  })),
  ...Array.from({ length: 3 }, (_, index) => ({
    description: "Setara SMA",
    label: `Tarbiyatul Muta'allimin ${index + 1}`,
    level: String(index + 1),
    name: `Tarbiyatul Muta'allimin ${index + 1}`,
    value: `tarbiyatul-mutaallimin-${index + 1}`,
  })),
];

function getInitialForm(data?: ClassGroup | null): ClassFormData {
  if (!data) {
    return emptyForm;
  }

  return {
    name: data.name,
    level: data.level ?? "",
    description: data.description ?? "",
  };
}

export function KelasForm({
  initialData,
  isSaving = false,
  onCancel,
  onSubmit,
}: KelasFormProps) {
  const [formData, setFormData] = useState<ClassFormData>(() =>
    getInitialForm(initialData),
  );
  const [selectedStandardClass, setSelectedStandardClass] = useState("");
  const [validationError, setValidationError] = useState("");

  function updateField(name: keyof ClassFormData, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleStandardClassChange(value: string) {
    setSelectedStandardClass(value);
    const selectedClass = standardClassOptions.find((option) => option.value === value);

    if (!selectedClass) {
      return;
    }

    setFormData({
      description: selectedClass.description,
      level: selectedClass.level,
      name: selectedClass.name,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (!formData.name.trim()) {
      setValidationError("Nama Kelas / Marhalah wajib diisi.");
      return;
    }

    await onSubmit(formData);

    if (!initialData) {
      setFormData(emptyForm);
    }
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      {validationError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {validationError}
        </div>
      ) : null}

      <div className="sm:col-span-2">
        <Select
          label="Pilih Struktur Standar"
          value={selectedStandardClass}
          onChange={(event) => handleStandardClassChange(event.target.value)}
          options={[
            { label: "Isi manual / pilih kelas standar", value: "" },
            ...standardClassOptions.map((option) => ({
              label: `${option.label} - ${option.description}`,
              value: option.value,
            })),
          ]}
        />
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Struktur standar: Ta&apos;sisiyah Dasar 1-6 setara SD, Marhalah
          Tarbiyatul Fityan 1-3 setara SMP, dan Tarbiyatul Muta&apos;allimin
          1-3 setara SMA.
        </p>
      </div>

      <Input
        label="Nama Kelas / Marhalah"
        placeholder="Tarbiyatul Fityan 1"
        value={formData.name}
        onChange={(event) => updateField("name", event.target.value)}
        required
      />
      <Input
        label="Tingkatan"
        placeholder="1"
        value={formData.level}
        onChange={(event) => updateField("level", event.target.value)}
      />
      <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
        Deskripsi
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          placeholder="Keterangan singkat kelas / marhalah"
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </label>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Simpan"}
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
