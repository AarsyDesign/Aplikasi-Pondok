"use client";

import { useEffect, useState } from "react";
import { GuruForm } from "@/components/guru/GuruForm";
import { GuruTable } from "@/components/guru/GuruTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "@/services/teacherService";
import { Teacher, TeacherFormData } from "@/types/teacher";

export default function GuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadTeachers() {
    setIsLoading(true);
    getTeachers()
      .then((teacherData) => setTeachers(teacherData))
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data guru.");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let isActive = true;

    getTeachers()
      .then((teacherData) => {
        if (isActive) {
          setTeachers(teacherData);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat data guru.");
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
    setSelectedTeacher(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function handleEditClick(teacher: Teacher) {
    setSelectedTeacher(teacher);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function handleCancel() {
    setSelectedTeacher(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(data: TeacherFormData) {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      if (selectedTeacher) {
        await updateTeacher(selectedTeacher.id, data);
        setSuccess("Data guru berhasil diperbarui.");
      } else {
        await createTeacher(data);
        setSuccess("Data guru berhasil ditambahkan.");
      }

      setSelectedTeacher(null);
      setShowForm(false);
      loadTeachers();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan data guru.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(teacher: Teacher) {
    const confirmed = window.confirm(`Hapus data guru ${teacher.full_name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(teacher.id);
      setError("");
      setSuccess("");
      await deleteTeacher(teacher.id);
      setSuccess("Data guru berhasil dihapus.");
      loadTeachers();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus data guru.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Data Guru</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola data guru untuk kebutuhan absensi harian.
          </p>
        </div>
        <Button type="button" onClick={handleAddClick}>
          Tambah Guru
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
            {selectedTeacher ? "Edit Guru" : "Tambah Guru"}
          </h2>
          <GuruForm
            key={selectedTeacher?.id ?? "new-teacher"}
            initialData={selectedTeacher}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Card>
      ) : null}

      {isLoading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Memuat data guru...
        </div>
      ) : (
        <GuruTable
          teachers={teachers}
          deletingId={deletingId}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
