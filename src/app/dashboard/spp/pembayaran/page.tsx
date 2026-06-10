"use client";

import { useEffect, useState } from "react";
import { SppPaymentForm } from "@/components/spp/SppPaymentForm";
import { SppPaymentTable } from "@/components/spp/SppPaymentTable";
import { Card } from "@/components/ui/Card";
import { createSppPayment, getSppBills, getSppPaymentsByStudent } from "@/services/sppService";
import { getStudents } from "@/services/studentService";
import { SppBill, SppPayment, SppPaymentFormData } from "@/types/spp";
import { Student } from "@/types/student";

export default function SppPembayaranPage() {
  const [bills, setBills] = useState<SppBill[]>([]);
  const [payments, setPayments] = useState<SppPayment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([getSppBills(), getStudents()])
      .then(([billData, studentData]) => {
        if (!active) return [];
        setBills(billData);
        setStudents(studentData);
        return billData[0]?.student_id ? getSppPaymentsByStudent(billData[0].student_id) : [];
      })
      .then((paymentData) => {
        if (active) setPayments(paymentData);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Gagal memuat pembayaran SPP.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(data: SppPaymentFormData) {
    try {
      setIsSaving(true); setError(""); setSuccess("");
      await createSppPayment(data);
      setSuccess("Pembayaran SPP berhasil disimpan.");
      const [billData, paymentData] = await Promise.all([getSppBills(), getSppPaymentsByStudent(data.student_id)]);
      setBills(billData);
      setPayments(paymentData);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan pembayaran SPP.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Input Pembayaran SPP</h1>
        <p className="mt-1 text-sm text-slate-600">Catat pembayaran SPP santri.</p>
      </div>
      {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div> : null}
      <Card>
        {isLoading ? <p className="text-sm text-slate-600">Memuat form pembayaran...</p> : <SppPaymentForm bills={bills} students={students} isSaving={isSaving} onSubmit={handleSubmit} />}
      </Card>
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-950">Riwayat Pembayaran Terbaru</h2>
        <SppPaymentTable payments={payments} />
      </div>
    </div>
  );
}
