"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ClassGroup } from "@/types/class";
import { Subject, SubjectFormData } from "@/types/subject";

type MapelFormProps = {
  classes: ClassGroup[];
  initialData?: Subject | null;
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit: (data: SubjectFormData) => Promise<void>;
};

const emptyForm: SubjectFormData = {
  name: "",
  class_id: "",
  description: "",
};

function getInitialForm(data?: Subject | null): SubjectFormData {
  if (!data) {
    return emptyForm;
  }

  return {
    name: data.name,
    class_id: data.class_id ?? "",
    description: data.description ?? "",
  };
}

export function MapelForm({
  classes,
  initialData,
  isSaving = false,
  onCancel,
  onSubmit,
}: MapelFormProps) {
  const [formData, setFormData] = useState<SubjectFormData>(() =>
    getInitialForm(initialData),
  );
  const [validationError, setValidationError] = useState("");

  function updateField(name: keyof SubjectFormData, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (!formData.name.trim()) {
      setValidationError("Nama Mata Pelajaran wajib diisi.");
      return;
    }

    if (!formData.class_id) {
      setValidationError("Kelas / Marhalah wajib dipilih.");
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
        label="Nama Mata Pelajaran"
        placeholder="Fiqih"
        value={formData.name}
        onChange={(event) => updateField("name", event.target.value)}
        required
      />
      <Select
        label="Kelas / Marhalah"
        value={formData.class_id}
        onChange={(event) => updateField("class_id", event.target.value)}
        options={[
          { label: "Pilih kelas / marhalah", value: "" },
          ...classes.map((classGroup) => ({
            label: classGroup.name,
            value: classGroup.id,
          })),
        ]}
        required
      />
      <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
        Deskripsi
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          placeholder="Keterangan singkat mata pelajaran"
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
