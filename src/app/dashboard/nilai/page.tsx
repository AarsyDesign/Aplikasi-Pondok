"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NilaiTable } from "@/components/nilai/NilaiTable";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { getClasses } from "@/services/classService";
import {
  deleteGrade,
  getAcademicYears,
  getGrades,
  getSemesters,
} from "@/services/gradeService";
import { getStudents } from "@/services/studentService";
import { ClassGroup } from "@/types/class";
import { AcademicYearOption, Grade, SemesterOption } from "@/types/grade";
import { Student } from "@/types/student";

export default function NilaiPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [semesters, setSemesters] = useState<SemesterOption[]>([]);
  const [classFilter, setClassFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [academicYearFilter, setAcademicYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadGrades() {
    setIsLoading(true);
    getGrades()
      .then((gradeData) => setGrades(gradeData))
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data nilai.");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let isActive = true;

    Promise.all([getGrades(), getClasses(), getStudents(), getAcademicYears(), getSemesters()])
      .then(([gradeData, classData, studentData, yearData, semesterData]) => {
        if (!isActive) {
          return;
        }

        setGrades(gradeData);
        setClasses(classData);
        setStudents(studentData);
        setAcademicYears(yearData);
        setSemesters(semesterData);
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat data nilai.");
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

  const filteredStudents = useMemo(() => {
    if (!classFilter) {
      return students;
    }

    return students.filter((student) => student.class_id === classFilter);
  }, [classFilter, students]);

  const filteredSemesters = useMemo(() => {
    if (!academicYearFilter) {
      return semesters;
    }

    return semesters.filter((semester) => semester.academic_year_id === academicYearFilter);
  }, [academicYearFilter, semesters]);

  const filteredGrades = useMemo(
    () =>
      grades.filter((grade) => {
        const matchesClass = !classFilter || grade.class_id === classFilter;
        const matchesStudent = !studentFilter || grade.student_id === studentFilter;
        const matchesYear = !academicYearFilter || grade.academic_year_id === academicYearFilter;
        const matchesSemester = !semesterFilter || grade.semester_id === semesterFilter;

        return matchesClass && matchesStudent && matchesYear && matchesSemester;
      }),
    [academicYearFilter, classFilter, grades, semesterFilter, studentFilter],
  );

  async function handleDelete(grade: Grade) {
    const confirmed = window.confirm(`Hapus nilai ${grade.subjectName} milik ${grade.studentName}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(grade.id);
      setError("");
      setSuccess("");
      await deleteGrade(grade.id);
      setSuccess("Nilai berhasil dihapus.");
      loadGrades();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Gagal menghapus nilai.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Data Nilai</h1>
          <p className="mt-1 text-sm text-slate-600">
            Rekap nilai santri berdasarkan kelas, periode, dan semester.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/nilai/input">Input Nilai</Link>
        </Button>
      </div>

      <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        <Select
          label="Pilih Kelas / Marhalah"
          value={classFilter}
          onChange={(event) => {
            setClassFilter(event.target.value);
            setStudentFilter("");
          }}
          options={[
            { label: "Semua kelas", value: "" },
            ...classes.map((classGroup) => ({ label: classGroup.name, value: classGroup.id })),
          ]}
        />
        <Select
          label="Pilih Santri"
          value={studentFilter}
          onChange={(event) => setStudentFilter(event.target.value)}
          options={[
            { label: "Semua santri", value: "" },
            ...filteredStudents.map((student) => ({
              label: student.full_name,
              value: student.id,
            })),
          ]}
        />
        <Select
          label="Tahun Ajaran"
          value={academicYearFilter}
          onChange={(event) => {
            setAcademicYearFilter(event.target.value);
            setSemesterFilter("");
          }}
          options={[
            { label: "Semua tahun ajaran", value: "" },
            ...academicYears.map((year) => ({ label: year.name, value: year.id })),
          ]}
        />
        <Select
          label="Semester"
          value={semesterFilter}
          onChange={(event) => setSemesterFilter(event.target.value)}
          options={[
            { label: "Semua semester", value: "" },
            ...filteredSemesters.map((semester) => ({
              label: semester.name,
              value: semester.id,
            })),
          ]}
        />
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

      {isLoading ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Memuat data nilai...
        </div>
      ) : (
        <NilaiTable
          grades={filteredGrades}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
