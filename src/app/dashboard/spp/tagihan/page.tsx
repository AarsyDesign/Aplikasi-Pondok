"use client";

import { useEffect, useMemo, useState } from "react";
import { SppBillForm } from "@/components/spp/SppBillForm";
import { SppBillTable } from "@/components/spp/SppBillTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { getClasses } from "@/services/classService";
import { createSppBill, deleteSppBill, getSppBills, updateSppBill } from "@/services/sppService";
import { getStudents } from "@/services/studentService";
import { ClassGroup } from "@/types/class";
import { getMonthName, SppBill, SppBillFormData, SppBillStatus } from "@/types/spp";
import { Student } from "@/types/student";

export default function SppTagihanPage() {
  const [bills, setBills] = useState<SppBill[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBill, setSelectedBill] = useState<SppBill | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [classFilter, setClassFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));
  const [statusFilter, setStatusFilter] = useState<SppBillStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadBills() {
    setIsLoading(true);
    getSppBills({ classId: classFilter, month: monthFilter, status: statusFilter, year: yearFilter })
      .then(setBills)
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Gagal memuat tagihan SPP."))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let active = true;
    Promise.all([getSppBills({ year: yearFilter }), getClasses(), getStudents()])
      .then(([billData, classData, studentData]) => {
        if (!active) return;
        setBills(billData);
        setClasses(classData);
        setStudents(studentData);
      })
      .catch((loadError: unknown) => active && setError(loadError instanceof Error ? loadError.message : "Gagal memuat tagihan SPP."))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, [yearFilter]);

  const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ label: getMonthName(i + 1), value: String(i + 1) })), []);

  async function handleSubmit(data: SppBillFormData) {
    try {
      setIsSaving(true); setError(""); setSuccess("");
      if (selectedBill) {
        await updateSppBill(selectedBill.id, data);
        setSuccess("Tagihan SPP berhasil diperbarui.");
      } else {
        await createSppBill(data);
        setSuccess("Tagihan SPP berhasil dibuat.");
      }
      setSelectedBill(null); setShowForm(false); loadBills();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan tagihan SPP.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(bill: SppBill) {
    if (!window.confirm(`Hapus tagihan SPP ${bill.studentName}?`)) return;
    try {
      setDeletingId(bill.id); setError(""); setSuccess("");
      await deleteSppBill(bill.id);
      setSuccess("Tagihan SPP berhasil dihapus.");
      loadBills();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus tagihan SPP.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h1 className="text-2xl font-bold text-slate-950">Tagihan SPP</h1><p className="mt-1 text-sm text-slate-600">Kelola tagihan SPP santri.</p></div>
        <Button type="button" onClick={() => { setSelectedBill(null); setShowForm(true); }}>Buat Tagihan</Button>
      </div>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Select label="Kelas / Marhalah" value={classFilter} onChange={(e) => setClassFilter(e.target.value)} options={[{ label: "Semua kelas", value: "" }, ...classes.map((c) => ({ label: c.name, value: c.id }))]} />
          <Select label="Bulan" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} options={[{ label: "Semua bulan", value: "" }, ...monthOptions]} />
          <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SppBillStatus | "")} options={[{ label: "Semua status", value: "" }, { label: "belum_bayar", value: "belum_bayar" }, { label: "sebagian", value: "sebagian" }, { label: "lunas", value: "lunas" }]} />
          <label className="block text-sm font-medium text-slate-700">Tahun<input className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3 text-sm" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} /></label>
        </div>
        <Button className="mt-4" type="button" variant="secondary" onClick={loadBills}>Terapkan Filter</Button>
      </Card>
      {error ? <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {success ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div> : null}
      {showForm ? <Card><h2 className="mb-4 text-lg font-semibold">{selectedBill ? "Edit Tagihan SPP" : "Buat Tagihan SPP"}</h2><SppBillForm key={selectedBill?.id ?? "new-bill"} students={students} initialData={selectedBill} isSaving={isSaving} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} /></Card> : null}
      {isLoading ? <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">Memuat tagihan SPP...</div> : <SppBillTable bills={bills} deletingId={deletingId} onEdit={(bill) => { setSelectedBill(bill); setShowForm(true); }} onDelete={handleDelete} />}
    </div>
  );
}
