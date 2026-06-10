"use client";

import { useEffect, useState } from "react";
import { KelasForm } from "@/components/kelas/KelasForm";
import { KelasTable } from "@/components/kelas/KelasTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Kelas / Marhalah</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola data kelas dan marhalah yang digunakan oleh santri dan mapel.
          </p>
        </div>
        <Button type="button" onClick={handleAddClick}>
          Tambah Kelas / Marhalah
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

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
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Memuat data kelas / marhalah...
        </div>
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
