"use client";

import { useEffect, useMemo, useState } from "react";
import { MapelForm } from "@/components/mapel/MapelForm";
import { MapelTable } from "@/components/mapel/MapelTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { getClasses } from "@/services/classService";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "@/services/subjectService";
import { ClassGroup } from "@/types/class";
import { Subject, SubjectFormData } from "@/types/subject";

export default function MapelPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [classFilter, setClassFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadSubjects() {
    setIsLoading(true);
    setError("");

    getSubjects()
      .then((subjectData) => {
        setSubjects(subjectData);
      })
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat data mata pelajaran.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    let isActive = true;

    Promise.all([getSubjects(), getClasses()])
      .then(([subjectData, classData]) => {
        if (!isActive) {
          return;
        }

        setSubjects(subjectData);
        setClasses(classData);
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat data mata pelajaran atau kelas.",
          );
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

  const filteredSubjects = useMemo(() => {
    if (!classFilter) {
      return subjects;
    }

    return subjects.filter((subject) => subject.class_id === classFilter);
  }, [classFilter, subjects]);

  function handleAddClick() {
    setSelectedSubject(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function handleEditClick(subject: Subject) {
    setSelectedSubject(subject);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function handleCancel() {
    setSelectedSubject(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(data: SubjectFormData) {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      if (selectedSubject) {
        await updateSubject(selectedSubject.id, data);
        setSuccess("Data mata pelajaran berhasil diperbarui.");
      } else {
        await createSubject(data);
        setSuccess("Data mata pelajaran berhasil ditambahkan.");
      }

      setSelectedSubject(null);
      setShowForm(false);
      loadSubjects();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan data mata pelajaran.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(subject: Subject) {
    const confirmed = window.confirm(`Hapus mata pelajaran ${subject.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(subject.id);
      setError("");
      setSuccess("");
      await deleteSubject(subject.id);
      setSuccess("Data mata pelajaran berhasil dihapus.");
      loadSubjects();
    } catch {
      setError("Mata pelajaran tidak bisa dihapus karena masih digunakan oleh data lain.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Mata Pelajaran</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola mata pelajaran dan hubungkan dengan kelas / marhalah.
          </p>
        </div>
        <Button type="button" onClick={handleAddClick}>
          Tambah Mata Pelajaran
        </Button>
      </div>

      <Card>
        <Select
          label="Kelas / Marhalah"
          value={classFilter}
          onChange={(event) => setClassFilter(event.target.value)}
          options={[
            { label: "Semua kelas / marhalah", value: "" },
            ...classes.map((classGroup) => ({
              label: classGroup.name,
              value: classGroup.id,
            })),
          ]}
        />
      </Card>

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
            {selectedSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
          </h2>
          <MapelForm
            key={selectedSubject?.id ?? "new-subject"}
            classes={classes}
            initialData={selectedSubject}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Card>
      ) : null}

      {isLoading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Memuat data mata pelajaran...
        </div>
      ) : (
        <MapelTable
          subjects={filteredSubjects}
          deletingId={deletingId}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
