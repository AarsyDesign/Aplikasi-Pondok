"use client";

import { useEffect, useState } from "react";
import { KelasForm } from "@/components/kelas/KelasForm";
import { KelasTable } from "@/components/kelas/KelasTable";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
} from "@/services/classService";
import { ClassFormData, ClassGroup } from "@/types/class";

export default function KelasPage() {
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadClasses() {
    setIsLoading(true);
    setError("");

    getClasses()
      .then((classData) => {
        setClasses(classData);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data kelas.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    let isActive = true;

    getClasses()
      .then((classData) => {
        if (isActive) {
          setClasses(classData);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat data kelas.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  function handleAddClick() {
    setSelectedClass(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function handleEditClick(classGroup: ClassGroup) {
    setSelectedClass(classGroup);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function handleCancel() {
    setSelectedClass(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(data: ClassFormData) {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      if (selectedClass) {
        await updateClass(selectedClass.id, data);
        setSuccess("Data kelas / marhalah berhasil diperbarui.");
      } else {
        await createClass(data);
        setSuccess("Data kelas / marhalah berhasil ditambahkan.");
      }

      setSelectedClass(null);
      setShowForm(false);
      loadClasses();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan data kelas / marhalah.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(classGroup: ClassGroup) {
    const confirmed = window.confirm(`Hapus kelas / marhalah ${classGroup.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(classGroup.id);
      setError("");
      setSuccess("");
      await deleteClass(classGroup.id);
      setSuccess("Data kelas / marhalah berhasil dihapus.");
      loadClasses();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus kelas / marhalah. Periksa apakah data masih digunakan.",
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
        <Button type="button" onClick={handleAddClick}>
          Tambah Kelas / Marhalah
        </Button>
        }
        description="Kelola kelas sesuai struktur pondok: dasar, fityan, dan muta'allimin."
        title="Kelas / Marhalah"
      />

      <Card>
        <h2 className="text-base font-semibold text-slate-950">Struktur Kelas</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">Ta&apos;sisiyah Dasar</p>
            <p className="mt-1 text-slate-600">Tingkat 1-6, setara SD.</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">Marhalah Tarbiyatul Fityan</p>
            <p className="mt-1 text-slate-600">Tingkat 1-3, setara SMP.</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-950">Tarbiyatul Muta&apos;allimin</p>
            <p className="mt-1 text-slate-600">Tingkat 1-3, setara SMA.</p>
          </div>
        </div>
      </Card>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {success ? <Alert variant="success">{success}</Alert> : null}

      {showForm ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">
            {selectedClass ? "Edit Kelas / Marhalah" : "Tambah Kelas / Marhalah"}
          </h2>
          <KelasForm
            key={selectedClass?.id ?? "new-class"}
            initialData={selectedClass}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Card>
      ) : null}

      {isLoading ? (
        <LoadingState message="Memuat data kelas / marhalah..." />
      ) : (
        <KelasTable
          classes={classes}
          deletingId={deletingId}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
