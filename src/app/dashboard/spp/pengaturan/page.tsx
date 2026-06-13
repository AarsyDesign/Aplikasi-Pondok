"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatResidenceType } from "@/lib/utils";
import { getAcademicYears } from "@/services/academicYearService";
import { getClasses } from "@/services/classService";
import { createSppSetting, deleteSppSetting, getSppSettings, updateSppSetting } from "@/services/sppService";
import { AcademicYear } from "@/types/academicYear";
import { ClassGroup } from "@/types/class";
import { formatRupiah, SppSetting, SppSettingFormData } from "@/types/spp";

const emptyForm: SppSettingFormData = {
  academic_year_id: "",
  amount: "",
  class_id: "",
  due_day: "10",
  is_active: true,
  note: "",
  residence_type: "",
};

function getInitialForm(setting?: SppSetting | null): SppSettingFormData {
  if (!setting) return emptyForm;

  return {
    academic_year_id: setting.academic_year_id ?? "",
    amount: String(setting.amount),
    class_id: setting.class_id ?? "",
    due_day: String(setting.due_day),
    is_active: Boolean(setting.is_active),
    note: setting.note ?? "",
    residence_type: setting.residence_type ?? "",
  };
}

export default function SppSettingsPage() {
  const [settings, setSettings] = useState<SppSetting[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<SppSetting | null>(null);
  const [formData, setFormData] = useState<SppSettingFormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function loadData() {
    setIsLoading(true);
    setError("");
    Promise.all([getSppSettings(), getAcademicYears(), getClasses()])
      .then(([settingData, academicYearData, classData]) => {
        setSettings(settingData);
        setAcademicYears(academicYearData);
        setClasses(classData);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat pengaturan SPP.");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let active = true;

    Promise.all([getSppSettings(), getAcademicYears(), getClasses()])
      .then(([settingData, academicYearData, classData]) => {
        if (!active) return;
        setSettings(settingData);
        setAcademicYears(academicYearData);
        setClasses(classData);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat pengaturan SPP.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function updateField<K extends keyof SppSettingFormData>(name: K, value: SppSettingFormData[K]) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function openNewForm() {
    setSelectedSetting(null);
    setFormData(emptyForm);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function openEditForm(setting: SppSetting) {
    setSelectedSetting(setting);
    setFormData(getInitialForm(setting));
    setShowForm(true);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");
      setError("");

      if (selectedSetting) {
        await updateSppSetting(selectedSetting.id, formData);
        setMessage("Pengaturan SPP berhasil diperbarui.");
      } else {
        await createSppSetting(formData);
        setMessage("Pengaturan SPP berhasil ditambahkan.");
      }

      setShowForm(false);
      setSelectedSetting(null);
      setFormData(emptyForm);
      loadData();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan pengaturan SPP.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(setting: SppSetting) {
    if (!window.confirm("Hapus pengaturan SPP ini?")) return;

    try {
      setDeletingId(setting.id);
      setMessage("");
      setError("");
      await deleteSppSetting(setting.id);
      setMessage("Pengaturan SPP berhasil dihapus.");
      loadData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus pengaturan SPP.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Button type="button" onClick={openNewForm}>Tambah Pengaturan</Button>}
        description="Atur nominal SPP berdasarkan tahun ajaran, kelas, dan status mukim/non mukim."
        title="Pengaturan SPP"
      />

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {message ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}

      {showForm ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{selectedSetting ? "Edit Pengaturan SPP" : "Tambah Pengaturan SPP"}</h2>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Select
              label="Tahun Ajaran"
              value={formData.academic_year_id}
              onChange={(event) => updateField("academic_year_id", event.target.value)}
              options={[{ label: "Pilih tahun ajaran", value: "" }, ...academicYears.map((year) => ({ label: year.name, value: year.id }))]}
              required
            />
            <Select
              label="Kelas / Marhalah"
              value={formData.class_id}
              onChange={(event) => updateField("class_id", event.target.value)}
              options={[{ label: "Semua kelas", value: "" }, ...classes.map((classGroup) => ({ label: classGroup.name, value: classGroup.id }))]}
            />
            <Select
              label="Status Santri"
              value={formData.residence_type}
              onChange={(event) => updateField("residence_type", event.target.value as SppSettingFormData["residence_type"])}
              options={[
                { label: "Semua", value: "" },
                { label: "Mukim", value: "mukim" },
                { label: "Non Mukim", value: "non_mukim" },
              ]}
            />
            <Input label="Nominal" type="number" min={0} value={formData.amount} onChange={(event) => updateField("amount", event.target.value)} required />
            <Input label="Tanggal Tagihan" type="number" min={1} max={28} value={formData.due_day} onChange={(event) => updateField("due_day", event.target.value)} required />
            <Select
              label="Status Aktif"
              value={formData.is_active ? "aktif" : "nonaktif"}
              onChange={(event) => updateField("is_active", event.target.value === "aktif")}
              options={[
                { label: "Aktif", value: "aktif" },
                { label: "Nonaktif", value: "nonaktif" },
              ]}
            />
            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
              Catatan
              <textarea
                className="mt-2 min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                value={formData.note}
                onChange={(event) => updateField("note", event.target.value)}
              />
            </label>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <Button type="submit" disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</Button>
              <Button type="button" variant="secondary" disabled={isSaving} onClick={() => setShowForm(false)}>Batal</Button>
            </div>
          </form>
        </Card>
      ) : null}

      {isLoading ? (
        <LoadingState message="Memuat pengaturan SPP..." />
      ) : settings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Belum ada pengaturan SPP.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Tahun Ajaran", "Kelas / Marhalah", "Status Santri", "Nominal", "Tanggal Tagihan", "Status Aktif", "Catatan", "Aksi"].map((header) => (
                    <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settings.map((setting) => (
                  <tr key={setting.id}>
                    <td className="px-4 py-3 font-medium text-slate-950">{setting.academicYearName}</td>
                    <td className="px-4 py-3 text-slate-700">{setting.className}</td>
                    <td className="px-4 py-3 text-slate-700">{setting.residence_type ? formatResidenceType(setting.residence_type) : "Semua"}</td>
                    <td className="px-4 py-3 font-medium text-slate-950">{formatRupiah(setting.amount)}</td>
                    <td className="px-4 py-3 text-slate-700">Tanggal {setting.due_day}</td>
                    <td className="px-4 py-3"><StatusBadge status={setting.is_active ? "aktif" : "nonaktif"} /></td>
                    <td className="px-4 py-3 text-slate-700">{setting.note || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="ghost" className="min-h-0 px-2 py-1 text-emerald-700" onClick={() => openEditForm(setting)}>Edit</Button>
                        <Button type="button" variant="ghost" className="min-h-0 px-2 py-1 text-red-700" disabled={deletingId === setting.id} onClick={() => handleDelete(setting)}>
                          {deletingId === setting.id ? "Menghapus..." : "Hapus"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
