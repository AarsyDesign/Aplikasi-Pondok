"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SantriTable } from "@/components/santri/SantriTable";
import { Button } from "@/components/ui/Button";
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Data Santri</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola data santri, pencarian, dan filter kelas.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/santri/tambah">Tambah Santri</Link>
        </Button>
      </div>

      <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_260px]">
        <label className="block text-sm font-medium text-slate-700">
          Pencarian
          <input
            className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
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
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Memuat data santri...
        </div>
      ) : (
        <SantriTable students={filteredStudents} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  );
}
