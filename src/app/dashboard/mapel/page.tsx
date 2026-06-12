"use client";

import { useEffect, useMemo, useState } from "react";
import { MapelForm } from "@/components/mapel/MapelForm";
import { MapelTable } from "@/components/mapel/MapelTable";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        actions={
        <Button type="button" onClick={handleAddClick}>
          Tambah Mata Pelajaran
        </Button>
        }
        description="Kelola mata pelajaran dan hubungkan dengan kelas / marhalah."
        title="Mata Pelajaran"
      />

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

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {success ? <Alert variant="success">{success}</Alert> : null}

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
        <LoadingState message="Memuat data mata pelajaran..." />
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
