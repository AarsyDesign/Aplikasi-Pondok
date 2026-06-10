"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  DEFAULT_INSTITUTION_PROFILE,
  InstitutionProfile,
  InstitutionProfileFormData,
} from "@/types/institution";

type InstitutionProfileFormProps = {
  initialData?: InstitutionProfile | null;
  isSaving: boolean;
  onSubmit: (data: InstitutionProfileFormData) => void;
};

function initialFormData(profile?: InstitutionProfile | null): InstitutionProfileFormData {
  const fallback = DEFAULT_INSTITUTION_PROFILE;

  return {
    address: profile?.address ?? "",
    city: profile?.city ?? fallback.city ?? "",
    default_homeroom_teacher_name:
      profile?.default_homeroom_teacher_name ?? fallback.default_homeroom_teacher_name ?? "",
    default_report_note: profile?.default_report_note ?? fallback.default_report_note ?? "",
    email: profile?.email ?? "",
    headmaster_name: profile?.headmaster_name ?? fallback.headmaster_name ?? "",
    name: profile?.name ?? fallback.name,
    phone: profile?.phone ?? "",
    short_name: profile?.short_name ?? fallback.short_name ?? "",
  };
}

export function InstitutionProfileForm({
  initialData,
  isSaving,
  onSubmit,
}: InstitutionProfileFormProps) {
  const [formData, setFormData] = useState<InstitutionProfileFormData>(() => initialFormData(initialData));
  const [error, setError] = useState("");

  function updateField(field: keyof InstitutionProfileFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Nama lembaga wajib diisi.");
      return;
    }

    setError("");
    onSubmit(formData);
  }

  function handleReset() {
    setFormData(initialFormData(initialData));
    setError("");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nama Lembaga"
          value={formData.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
        <Input
          label="Nama Pendek"
          value={formData.short_name}
          onChange={(event) => updateField("short_name", event.target.value)}
        />
        <Input
          label="Kota"
          value={formData.city}
          onChange={(event) => updateField("city", event.target.value)}
        />
        <Input
          label="Nomor Telepon"
          value={formData.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <Input
          label="Nama Mudir"
          value={formData.headmaster_name}
          onChange={(event) => updateField("headmaster_name", event.target.value)}
        />
        <Input
          label="Nama Wali Kelas Default"
          value={formData.default_homeroom_teacher_name}
          onChange={(event) => updateField("default_homeroom_teacher_name", event.target.value)}
        />
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Alamat
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          value={formData.address}
          onChange={(event) => updateField("address", event.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Catatan Umum Default Raport
        <textarea
          className="mt-2 min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          value={formData.default_report_note}
          onChange={(event) => updateField("default_report_note", event.target.value)}
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
