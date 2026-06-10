"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
  const [validationError, setValidationError] = useState("");

  function updateField(name: keyof ClassFormData, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
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
