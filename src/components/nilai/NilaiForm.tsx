"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { Select } from "@/components/ui/Select";
import { getClasses } from "@/services/classService";
import {
  getAcademicYears,
  getGradesByStudentAndPeriod,
  getSemesters,
  upsertGrades,
} from "@/services/gradeService";
import { getStudents } from "@/services/studentService";
import { getSubjectsByClass } from "@/services/subjectService";
import { ClassGroup } from "@/types/class";
import {
  AcademicYearOption,
  GradeInputRow,
  GradeUpsertInput,
  SemesterOption,
} from "@/types/grade";
import { Student } from "@/types/student";
import { Subject } from "@/types/subject";

function scoreToInput(value: number | null) {
  return value === null ? "" : String(value);
}

function parseScore(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  return Number(trimmedValue);
}

function hasInput(row: GradeInputRow) {
  return Boolean(
    row.existingGradeId ||
      row.daily_score.trim() ||
      row.task_score.trim() ||
      row.exam_score.trim() ||
      row.final_score.trim() ||
      row.teacher_note.trim(),
  );
}

export function NilaiForm() {
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [semesters, setSemesters] = useState<SemesterOption[]>([]);
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [rows, setRows] = useState<GradeInputRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat data input nilai.");
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

  useEffect(() => {
    if (!classId || !studentId || !academicYearId || !semesterId) {
      Promise.resolve().then(() => {
        setSubjects([]);
        setRows([]);
        setIsLoadingSubjects(false);
      });
      return;
    }

    let isActive = true;
    Promise.resolve().then(() => {
      if (isActive) {
        setIsLoadingSubjects(true);
        setError("");
      }
    });

    Promise.all([
      getSubjectsByClass(classId),
      getGradesByStudentAndPeriod(studentId, semesterId, academicYearId),
    ])
      .then(([subjectData, gradeData]) => {
        if (!isActive) {
          return;
        }

        const gradeMap = new Map(gradeData.map((grade) => [grade.subject_id, grade]));
        setSubjects(subjectData);
        setRows(
          subjectData.map((subject) => {
            const existingGrade = gradeMap.get(subject.id);

            return {
              existingGradeId: existingGrade?.id,
              subject_id: subject.id,
              daily_score: scoreToInput(existingGrade?.daily_score ?? null),
              task_score: scoreToInput(existingGrade?.task_score ?? null),
              exam_score: scoreToInput(existingGrade?.exam_score ?? null),
              final_score: scoreToInput(existingGrade?.final_score ?? null),
              teacher_note: existingGrade?.teacher_note ?? "",
            };
          }),
        );
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat mata pelajaran.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingSubjects(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [academicYearId, classId, semesterId, studentId]);

  function updateRow(subjectId: string, field: keyof GradeInputRow, value: string) {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.subject_id === subjectId ? { ...row, [field]: value } : row,
      ),
    );
  }

  function validateScore(value: string, label: string, subjectName: string) {
    if (!value.trim()) {
      return null;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
      return `${label} untuk ${subjectName} harus angka 0 sampai 100.`;
    }

    return null;
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!classId || !studentId || !semesterId || !academicYearId) {
      setError("Kelas, santri, tahun ajaran, dan semester wajib dipilih sebelum menyimpan.");
      return;
    }

    const subjectMap = new Map(subjects.map((subject) => [subject.id, subject.name]));
    const validationError = rows.reduce<string | null>((currentError, row) => {
      if (currentError) {
        return currentError;
      }

      const subjectName = subjectMap.get(row.subject_id) ?? "Mata Pelajaran";

      return (
        validateScore(row.daily_score, "Nilai Harian", subjectName) ??
        validateScore(row.task_score, "Nilai Tugas", subjectName) ??
        validateScore(row.exam_score, "Nilai Ujian", subjectName) ??
        validateScore(row.final_score, "Nilai Akhir", subjectName)
      );
    }, null);

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: GradeUpsertInput[] = rows.filter(hasInput).map((row) => ({
      academic_year_id: academicYearId,
      class_id: classId,
      daily_score: parseScore(row.daily_score),
      exam_score: parseScore(row.exam_score),
      final_score: parseScore(row.final_score),
      id: row.existingGradeId,
      semester_id: semesterId,
      student_id: studentId,
      subject_id: row.subject_id,
      task_score: parseScore(row.task_score),
      teacher_note: row.teacher_note.trim() || null,
    }));

    if (payload.length === 0) {
      setError("Isi minimal satu nilai atau catatan sebelum menyimpan.");
      return;
    }

    try {
      setIsSaving(true);
      await upsertGrades(payload);
      setSuccess("Nilai berhasil disimpan.");
      const refreshedGrades = await getGradesByStudentAndPeriod(
        studentId,
        semesterId,
        academicYearId,
      );
      const gradeMap = new Map(refreshedGrades.map((grade) => [grade.subject_id, grade]));
      setRows((currentRows) =>
        currentRows.map((row) => {
          const refreshedGrade = gradeMap.get(row.subject_id);

          return refreshedGrade
            ? {
                ...row,
                existingGradeId: refreshedGrade.id,
                daily_score: scoreToInput(refreshedGrade.daily_score),
                exam_score: scoreToInput(refreshedGrade.exam_score),
                final_score: scoreToInput(refreshedGrade.final_score),
                task_score: scoreToInput(refreshedGrade.task_score),
                teacher_note: refreshedGrade.teacher_note ?? "",
              }
            : row;
        }),
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan nilai.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <LoadingState message="Memuat form input nilai..." />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            ...academicYears.map((year) => ({
              label: year.name,
              value: year.id,
            })),
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
      </Card>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      {success ? <Alert variant="success">{success}</Alert> : null}

      {!studentId ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm">
          Pilih kelas, santri, tahun ajaran, dan semester untuk mulai input nilai.
        </div>
      ) : isLoadingSubjects ? (
        <LoadingState message="Memuat mata pelajaran..." />
      ) : subjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Belum ada mata pelajaran untuk kelas ini.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  {[
                    "Mata Pelajaran",
                    "Nilai Harian",
                    "Nilai Tugas",
                    "Nilai Ujian",
                    "Nilai Akhir",
                    "Catatan Guru",
                  ].map((header) => (
                    <th key={header} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((subject) => {
                  const row = rows.find((item) => item.subject_id === subject.id);

                  return (
                    <tr key={subject.id} className="transition hover:bg-emerald-50/40">
                      <td className="min-w-48 px-4 py-3.5 font-semibold text-slate-950">
                        {subject.name}
                      </td>
                      {(["daily_score", "task_score", "exam_score", "final_score"] as const).map(
                        (field) => (
                          <td key={field} className="px-4 py-3.5">
                            <input
                              className="h-11 w-28 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                              inputMode="decimal"
                              min={0}
                              max={100}
                              type="number"
                              value={row?.[field] ?? ""}
                              onChange={(event) =>
                                updateRow(subject.id, field, event.target.value)
                              }
                            />
                          </td>
                        ),
                      )}
                      <td className="px-4 py-3.5">
                        <input
                          className="h-11 w-72 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                          placeholder="Catatan Guru"
                          value={row?.teacher_note ?? ""}
                          onChange={(event) =>
                            updateRow(subject.id, "teacher_note", event.target.value)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 p-4">
            <Button type="button" onClick={handleSave} isLoading={isSaving}>
              Simpan Nilai
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
