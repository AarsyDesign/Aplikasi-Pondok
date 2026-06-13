"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { isValidOptionalPhoneNumber } from "@/lib/utils";
import { Teacher, TeacherFormData } from "@/types/teacher";

type GuruFormProps = {
  initialData?: Teacher | null;
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit: (data: TeacherFormData) => Promise<void>;
};

const emptyForm: TeacherFormData = {
  full_name: "",
  phone: "",
  address: "",
  status: "aktif",
};

function getInitialForm(data?: Teacher | null): TeacherFormData {
  if (!data) {
    return emptyForm;
  }

  return {
    full_name: data.full_name,
    phone: data.phone ?? "",
    address: data.address ?? "",
    status: data.status,
  };
}

export function GuruForm({
  initialData,
  isSaving = false,
  onCancel,
  onSubmit,
}: GuruFormProps) {
  const [formData, setFormData] = useState<TeacherFormData>(() =>
    getInitialForm(initialData),
  );
  const [validationError, setValidationError] = useState("");

  function updateField(name: keyof TeacherFormData, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");

    if (!formData.full_name.trim()) {
      setValidationError("Nama guru wajib diisi.");
      return;
    }

    if (!isValidOptionalPhoneNumber(formData.phone)) {
      setValidationError("Nomor HP tidak valid. Gunakan angka, spasi, +, -, atau tanda kurung.");
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
        label="Nama Guru"
        placeholder="Ust. Ahmad"
        value={formData.full_name}
        onChange={(event) => updateField("full_name", event.target.value)}
        required
      />
      <Input
        label="Nomor HP"
        inputMode="tel"
        placeholder="08123456789"
        value={formData.phone}
        onChange={(event) => updateField("phone", event.target.value)}
      />
      <Select
        label="Status"
        value={formData.status}
        onChange={(event) => updateField("status", event.target.value)}
        options={[
          { label: "aktif", value: "aktif" },
          { label: "nonaktif", value: "nonaktif" },
        ]}
      />
      <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
        Alamat
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          placeholder="Alamat guru"
          value={formData.address}
          onChange={(event) => updateField("address", event.target.value)}
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
