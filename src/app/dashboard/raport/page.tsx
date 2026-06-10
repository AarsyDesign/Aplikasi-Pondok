"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { getClasses } from "@/services/classService";
import { getAcademicYears, getSemesters } from "@/services/gradeService";
import { getStudents } from "@/services/studentService";
import { ClassGroup } from "@/types/class";
import { AcademicYearOption, SemesterOption } from "@/types/grade";
import { Student } from "@/types/student";

export default function RaportPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [semesters, setSemesters] = useState<SemesterOption[]>([]);
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    Promise.all([getClasses(), getStudents(), getAcademicYears(), getSemesters()])
      .then(([classData, studentData, yearData, semesterData]) => {
        if (!isActive) {
          return;
        }

        setClasses(classData);
        setStudents(studentData);
        setAcademicYears(yearData);
        setSemesters(semesterData);
        const activeAcademicYearId = yearData.find((year) => year.is_active)?.id ?? yearData[0]?.id ?? "";
        setAcademicYearId(activeAcademicYearId);
        setSemesterId(
          semesterData.find((semester) => semester.academic_year_id === activeAcademicYearId && semester.is_active)?.id ??
            semesterData.find((semester) => semester.academic_year_id === activeAcademicYearId)?.id ??
            semesterData[0]?.id ??
            "",
        );
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat filter raport.");
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
    if (!classId) {
      return [];
    }

    return students.filter((student) => student.class_id === classId);
  }, [classId, students]);

  const filteredSemesters = useMemo(() => {
    if (!academicYearId) {
      return semesters;
    }

    return semesters.filter((semester) => semester.academic_year_id === academicYearId);
  }, [academicYearId, semesters]);

  const canOpenReport = Boolean(studentId && semesterId && academicYearId);

  function handleOpenReport() {
    if (!canOpenReport) {
      setError("Kelas, santri, semester, dan tahun ajaran wajib dipilih.");
      return;
    }

    router.push(
      `/dashboard/raport/${studentId}?semesterId=${semesterId}&academicYearId=${academicYearId}`,
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Raport Santri</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pilih santri dan periode untuk melihat preview raport.
        </p>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-sm text-slate-600">Memuat pilihan raport...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Pilih Kelas / Marhalah"
              value={classId}
              onChange={(event) => {
                setClassId(event.target.value);
                setStudentId("");
              }}
              options={[
                { label: "Pilih kelas / marhalah", value: "" },
                ...classes.map((classGroup) => ({
                  label: classGroup.name,
                  value: classGroup.id,
                })),
              ]}
            />
            <Select
              label="Pilih Santri"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              options={[
                { label: "Pilih santri", value: "" },
                ...filteredStudents.map((student) => ({
                  label: `${student.full_name} (${student.nis || "-"})`,
                  value: student.id,
                })),
              ]}
            />
            <Select
              label="Tahun Ajaran"
              value={academicYearId}
              onChange={(event) => {
                const nextAcademicYearId = event.target.value;
                setAcademicYearId(nextAcademicYearId);
                setSemesterId(
                  semesters.find((semester) => semester.academic_year_id === nextAcademicYearId && semester.is_active)?.id ??
                    semesters.find((semester) => semester.academic_year_id === nextAcademicYearId)?.id ??
                    "",
                );
              }}
              options={[
                { label: "Pilih tahun ajaran", value: "" },
                ...academicYears.map((year) => ({ label: year.name, value: year.id })),
              ]}
            />
            <Select
              label="Semester"
              value={semesterId}
              onChange={(event) => setSemesterId(event.target.value)}
              options={[
                { label: "Pilih semester", value: "" },
                ...filteredSemesters.map((semester) => ({
                  label: semester.name,
                  value: semester.id,
                })),
              ]}
            />
            <div className="sm:col-span-2 xl:col-span-4">
              <Button type="button" disabled={!canOpenReport} onClick={handleOpenReport}>
                Lihat Raport
              </Button>
              {!canOpenReport ? (
                <p className="mt-2 text-sm text-slate-500">
                  Lengkapi pilihan santri, tahun ajaran, dan semester.
                </p>
              ) : null}
            </div>
          </div>
        )}
      </Card>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
