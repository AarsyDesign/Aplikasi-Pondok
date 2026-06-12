"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SantriTable } from "@/components/santri/SantriTable";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { getClasses } from "@/services/classService";
import { deleteStudent, getStudents } from "@/services/studentService";
import { ClassGroup } from "@/types/class";
import { Student } from "@/types/student";

export default function SantriPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let isActive = true;

    Promise.all([getStudents(), getClasses().catch(() => [])])
      .then(([studentData, classData]) => {
        if (!isActive) {
          return;
        }

        setStudents(studentData);
        setClasses(classData);
      })
      .catch((loadError: unknown) => {
        if (!isActive) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data santri.");
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

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !keyword ||
        student.full_name.toLowerCase().includes(keyword) ||
        (student.nis ?? "").toLowerCase().includes(keyword);
      const matchesClass = !classFilter || student.class_id === classFilter;

      return matchesSearch && matchesClass;
    });
  }, [classFilter, search, students]);

  async function handleDelete(student: Student) {
    const confirmed = window.confirm(`Hapus data santri ${student.full_name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(student.id);
      setError("");
      await deleteStudent(student.id);
      setStudents((current) => current.filter((item) => item.id !== student.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus santri.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
        <Button asChild>
          <Link href="/dashboard/santri/tambah">Tambah Santri</Link>
        </Button>
        }
        description="Kelola data santri, pencarian, dan filter kelas."
        title="Data Santri"
      />

      <Card className="grid gap-4 md:grid-cols-[1fr_260px]">
        <label className="block text-sm font-semibold text-slate-700">
          Pencarian
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            placeholder="Cari nama atau NIS..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <Select
          label="Kelas / Marhalah"
          value={classFilter}
          onChange={(event) => setClassFilter(event.target.value)}
          options={[
            { label: "Semua kelas", value: "" },
            ...classes.map((classGroup) => ({
              label: classGroup.name,
              value: classGroup.id,
            })),
          ]}
        />
      </Card>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {isLoading ? (
        <LoadingState message="Memuat data santri..." />
      ) : (
        <SantriTable students={filteredStudents} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  );
}
