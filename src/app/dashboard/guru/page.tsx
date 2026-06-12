"use client";

import { useEffect, useState } from "react";
import { GuruForm } from "@/components/guru/GuruForm";
import { GuruTable } from "@/components/guru/GuruTable";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        actions={
        <Button type="button" onClick={handleAddClick}>
          Tambah Guru
        </Button>
        }
        description="Kelola data guru untuk kebutuhan absensi harian."
        title="Data Guru"
      />

      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

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
        <LoadingState message="Memuat data guru..." />
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
