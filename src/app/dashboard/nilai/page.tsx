"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NilaiTable } from "@/components/nilai/NilaiTable";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        actions={
        <Button asChild>
          <Link href="/dashboard/nilai/input">Input Nilai</Link>
        </Button>
        }
        description="Rekap nilai santri berdasarkan kelas, periode, dan semester."
        title="Data Nilai"
      />

      <Card className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      </Card>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {success ? <Alert variant="success">{success}</Alert> : null}

      {isLoading ? (
        <LoadingState message="Memuat data nilai..." />
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
