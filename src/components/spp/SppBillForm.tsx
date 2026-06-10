"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getMonthName, SppBill, SppBillFormData } from "@/types/spp";
import { Student } from "@/types/student";

type SppBillFormProps = {
  initialData?: SppBill | null;
  isSaving?: boolean;
  onCancel?: () => void;
  onSubmit: (data: SppBillFormData) => Promise<void>;
  students: Student[];
};

function getInitialForm(data?: SppBill | null): SppBillFormData {
  const now = new Date();
  return {
    amount: data ? String(data.amount) : "",
    bill_month: data ? String(data.bill_month) : String(now.getMonth() + 1),
    bill_year: data ? String(data.bill_year) : String(now.getFullYear()),
    note: data?.note ?? "",
    student_id: data?.student_id ?? "",
  };
}

export function SppBillForm({ initialData, isSaving = false, onCancel, onSubmit, students }: SppBillFormProps) {
  const [formData, setFormData] = useState<SppBillFormData>(() => getInitialForm(initialData));
  const [validationError, setValidationError] = useState("");

  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => ({ label: getMonthName(index + 1), value: String(index + 1) })),
    [],
  );

  function updateField(name: keyof SppBillFormData, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    const amount = Number(formData.amount);

    if (!formData.student_id || !formData.bill_month || !formData.bill_year || !formData.amount) {
      setValidationError("Santri, bulan, tahun, dan nominal wajib diisi.");
      return;
    }

    if (Number.isNaN(amount) || amount < 0) {
      setValidationError("Nominal tagihan tidak boleh negatif.");
      return;
    }

    await onSubmit(formData);
    if (!initialData) setFormData(getInitialForm(null));
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      {validationError ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{validationError}</div> : null}
      <Select
        label="Santri"
        value={formData.student_id}
        onChange={(event) => updateField("student_id", event.target.value)}
        options={[{ label: "Pilih santri", value: "" }, ...students.map((student) => ({ label: `${student.full_name} - ${student.className}`, value: student.id }))]}
        required
      />
      <Select label="Bulan" value={formData.bill_month} onChange={(event) => updateField("bill_month", event.target.value)} options={monthOptions} required />
      <Input label="Tahun" type="number" value={formData.bill_year} onChange={(event) => updateField("bill_year", event.target.value)} required />
      <Input label="Nominal" type="number" value={formData.amount} onChange={(event) => updateField("amount", event.target.value)} required />
      <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
        Catatan
        <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" value={formData.note} onChange={(event) => updateField("note", event.target.value)} />
      </label>
      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</Button>
        {onCancel ? <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Batal</Button> : null}
      </div>
    </form>
  );
}
