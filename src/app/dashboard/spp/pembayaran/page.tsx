"use client";

import { useEffect, useState } from "react";
import { SppPaymentForm } from "@/components/spp/SppPaymentForm";
import { SppPaymentTable } from "@/components/spp/SppPaymentTable";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        description="Catat pembayaran SPP santri."
        title="Input Pembayaran SPP"
      />
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}
      <Card>
        {isLoading ? <LoadingState message="Memuat form pembayaran..." /> : <SppPaymentForm bills={bills} students={students} isSaving={isSaving} onSubmit={handleSubmit} />}
      </Card>
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-950">Riwayat Pembayaran Terbaru</h2>
        <SppPaymentTable payments={payments} />
      </div>
    </div>
  );
}
