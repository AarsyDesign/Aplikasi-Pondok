"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { isPositiveNumber } from "@/lib/utils";
import { formatRupiah, getMonthName, SppBill, SppPaymentFormData } from "@/types/spp";
import { Student } from "@/types/student";

type SppPaymentFormProps = {
  bills: SppBill[];
  isSaving?: boolean;
  onSubmit: (data: SppPaymentFormData) => Promise<void>;
  students: Student[];
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function SppPaymentForm({ bills, isSaving = false, onSubmit, students }: SppPaymentFormProps) {
  const [formData, setFormData] = useState<SppPaymentFormData>({
    amount_paid: "",
    bill_id: "",
    note: "",
    payment_date: getToday(),
    payment_method: "tunai",
    student_id: "",
  });
  const [validationError, setValidationError] = useState("");

  const billOptions = useMemo(
    () =>
      bills
        .filter((bill) => bill.student_id === formData.student_id && bill.status !== "lunas")
        .map((bill) => ({
          label: `${getMonthName(bill.bill_month)} ${bill.bill_year} - Sisa ${formatRupiah(bill.remaining)}`,
          value: bill.id,
        })),
    [bills, formData.student_id],
  );

  function updateField(name: keyof SppPaymentFormData, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError("");
    const amount = Number(formData.amount_paid);
    const selectedBill = bills.find((bill) => bill.id === formData.bill_id);

    if (!formData.student_id || !formData.bill_id || !formData.payment_date || !formData.amount_paid) {
      setValidationError("Santri, tagihan, tanggal, dan nominal pembayaran wajib diisi.");
      return;
    }

    if (!isPositiveNumber(formData.amount_paid)) {
      setValidationError("Nominal pembayaran harus lebih dari 0.");
      return;
    }

    if (!selectedBill) {
      setValidationError("Tagihan SPP tidak ditemukan.");
      return;
    }

    if (amount > selectedBill.remaining) {
      setValidationError("Nominal pembayaran tidak boleh melebihi sisa tagihan.");
      return;
    }

    await onSubmit(formData);
    setFormData({
      amount_paid: "",
      bill_id: "",
      note: "",
      payment_date: getToday(),
      payment_method: "tunai",
      student_id: "",
    });
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
      {validationError ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{validationError}</div> : null}
      <Select label="Santri" value={formData.student_id} onChange={(event) => { updateField("student_id", event.target.value); updateField("bill_id", ""); }} options={[{ label: "Pilih santri", value: "" }, ...students.map((student) => ({ label: `${student.full_name} - ${student.className}`, value: student.id }))]} required />
      <Select label="Tagihan Bulan/Tahun" value={formData.bill_id} onChange={(event) => updateField("bill_id", event.target.value)} options={[{ label: "Pilih tagihan", value: "" }, ...billOptions]} required />
      <Input label="Tanggal Pembayaran" type="date" value={formData.payment_date} onChange={(event) => updateField("payment_date", event.target.value)} required />
      <Input label="Nominal Pembayaran" type="number" min={1} value={formData.amount_paid} onChange={(event) => updateField("amount_paid", event.target.value)} required />
      <Select label="Metode Pembayaran" value={formData.payment_method} onChange={(event) => updateField("payment_method", event.target.value)} options={[{ label: "tunai", value: "tunai" }, { label: "transfer", value: "transfer" }, { label: "lainnya", value: "lainnya" }]} />
      <Input label="Catatan" value={formData.note} onChange={(event) => updateField("note", event.target.value)} />
      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan Pembayaran"}</Button>
      </div>
    </form>
  );
}
