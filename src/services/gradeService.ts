import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getAcademicYears as getManagedAcademicYears } from "@/services/academicYearService";
import { getSemesters as getManagedSemesters } from "@/services/semesterService";
import {
  AcademicYear as AcademicYearRow,
  Class as ClassRow,
  Database,
  Grade as GradeRow,
  Semester as SemesterRow,
  Student as StudentRow,
  Subject as SubjectRow,
} from "@/types/database";
import {
  AcademicYearOption,
  Grade,
  GradeUpsertInput,
  SemesterOption,
} from "@/types/grade";

type GradeInsert = Database["public"]["Tables"]["grades"]["Insert"];
type GradeUpdate = Database["public"]["Tables"]["grades"]["Update"];

export const mockGrades: Grade[] = [
  {
    id: "nl-001",
    student_id: "st-001",
    studentId: "st-001",
    studentName: "Ahmad Fauzan",
    class_id: "kl-001",
    classId: "kl-001",
    className: "Marhalah 1",
    subject_id: "mp-001",
    subjectId: "mp-001",
    subjectName: "Fiqih",
    semester_id: "sm-001",
    semesterId: "sm-001",
    semesterName: "Semester 1",
    academic_year_id: "ay-001",
    academicYearId: "ay-001",
    academicYearName: "2026/2027",
    daily_score: 86,
    task_score: 84,
    exam_score: 88,
    final_score: 86,
    teacher_note: "Pemahaman baik",
    score: 86,
    predicate: "A",
    note: "Pemahaman baik",
  },
];

function getPredicate(score: number): Grade["predicate"] {
  if (score >= 85) {
    return "A";
  }

  if (score >= 75) {
    return "B";
  }

  return "C";
}

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

function createNameMap<T extends { id: string; name?: string; full_name?: string }>(
  rows: T[],
) {
  return new Map(rows.map((row) => [row.id, row.name ?? row.full_name ?? "-"]));
}

function mapGrade(
  row: GradeRow,
  lookups: {
    academicYears: Map<string, string>;
    classes: Map<string, string>;
    semesters: Map<string, string>;
    students: Map<string, string>;
    subjects: Map<string, string>;
  },
): Grade {
  const score = Number(
    row.final_score ?? row.exam_score ?? row.task_score ?? row.daily_score ?? 0,
  );

  return {
    id: row.id,
    student_id: row.student_id,
    studentId: row.student_id,
    studentName: row.student_id
      ? (lookups.students.get(row.student_id) ?? "Santri tidak ditemukan")
      : "-",
    class_id: row.class_id,
    classId: row.class_id,
    className: row.class_id
      ? (lookups.classes.get(row.class_id) ?? "Kelas tidak ditemukan")
      : "-",
    subject_id: row.subject_id,
    subjectId: row.subject_id,
    subjectName: row.subject_id
      ? (lookups.subjects.get(row.subject_id) ?? "Mata pelajaran tidak ditemukan")
      : "-",
    semester_id: row.semester_id,
    semesterId: row.semester_id,
    semesterName: row.semester_id
      ? (lookups.semesters.get(row.semester_id) ?? "Semester tidak ditemukan")
      : "-",
    academic_year_id: row.academic_year_id,
    academicYearId: row.academic_year_id,
    academicYearName: row.academic_year_id
      ? (lookups.academicYears.get(row.academic_year_id) ?? "Tahun ajaran tidak ditemukan")
      : "-",
    daily_score: row.daily_score,
    task_score: row.task_score,
    exam_score: row.exam_score,
    final_score: row.final_score,
    teacher_note: row.teacher_note,
    created_at: row.created_at,
    updated_at: row.updated_at,
    score,
    predicate: getPredicate(score),
    note: row.teacher_note ?? "-",
  };
}

async function getLookups() {
  const supabase = requireSupabase();
  const [students, classes, subjects, semesters, academicYears] = await Promise.all([
    supabase.from("students").select("id, full_name"),
    supabase.from("classes").select("id, name"),
    supabase.from("subjects").select("id, name"),
    supabase.from("semesters").select("id, name"),
    supabase.from("academic_years").select("id, name"),
  ]);

  if (students.error) {
    throw new Error(`Gagal mengambil lookup santri: ${students.error.message}`);
  }

  if (classes.error) {
    throw new Error(`Gagal mengambil lookup kelas: ${classes.error.message}`);
  }

  if (subjects.error) {
    throw new Error(`Gagal mengambil lookup mapel: ${subjects.error.message}`);
  }

  if (semesters.error) {
    throw new Error(`Gagal mengambil lookup semester: ${semesters.error.message}`);
  }

  if (academicYears.error) {
    throw new Error(`Gagal mengambil lookup tahun ajaran: ${academicYears.error.message}`);
  }

  return {
    academicYears: createNameMap(academicYears.data as Pick<AcademicYearRow, "id" | "name">[]),
    classes: createNameMap(classes.data as Pick<ClassRow, "id" | "name">[]),
    semesters: createNameMap(semesters.data as Pick<SemesterRow, "id" | "name">[]),
    students: createNameMap(students.data as Pick<StudentRow, "id" | "full_name">[]),
    subjects: createNameMap(subjects.data as Pick<SubjectRow, "id" | "name">[]),
  };
}

export async function getAcademicYears(): Promise<AcademicYearOption[]> {
  return getManagedAcademicYears();
}

export async function getSemesters(): Promise<SemesterOption[]> {
  return getManagedSemesters();
}

export async function getGrades() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return mockGrades;
  }

  const [lookups, gradesResult] = await Promise.all([
    getLookups(),
    supabase.from("grades").select("*").order("created_at", { ascending: false }),
  ]);

  const { data, error } = gradesResult;

  if (error) {
    throw new Error(`Gagal mengambil data nilai: ${error.message}`);
  }

  return data.map((grade) => mapGrade(grade, lookups));
}

export async function getGradesByStudent(studentId: string) {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return mockGrades.filter((grade) => grade.studentId === studentId);
  }

  const [lookups, gradesResult] = await Promise.all([
    getLookups(),
    supabase
      .from("grades")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false }),
  ]);

  const { data, error } = gradesResult;

  if (error) {
    throw new Error(`Gagal mengambil nilai santri: ${error.message}`);
  }

  return data.map((grade) => mapGrade(grade, lookups));
}

export async function getGradesByStudentAndPeriod(
  studentId: string,
  semesterId: string,
  academicYearId: string,
) {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return mockGrades.filter(
      (grade) =>
        grade.studentId === studentId &&
        grade.semesterId === semesterId &&
        grade.academicYearId === academicYearId,
    );
  }

  const [lookups, gradesResult] = await Promise.all([
    getLookups(),
    supabase
      .from("grades")
      .select("*")
      .eq("student_id", studentId)
      .eq("semester_id", semesterId)
      .eq("academic_year_id", academicYearId)
      .order("created_at", { ascending: false }),
  ]);

  const { data, error } = gradesResult;

  if (error) {
    throw new Error(`Gagal mengambil nilai periode santri: ${error.message}`);
  }

  return data.map((grade) => mapGrade(grade, lookups));
}

export async function upsertGrades(grades: GradeUpsertInput[]) {
  const supabase = requireSupabase();
  const savedGrades: GradeRow[] = [];

  for (const grade of grades) {
    const { data: existingGrade, error: lookupError } = await supabase
      .from("grades")
      .select("id")
      .eq("student_id", grade.student_id)
      .eq("subject_id", grade.subject_id)
      .eq("semester_id", grade.semester_id)
      .eq("academic_year_id", grade.academic_year_id)
      .maybeSingle();

    if (lookupError) {
      throw new Error(`Gagal memeriksa nilai lama: ${lookupError.message}`);
    }

    if (existingGrade) {
      const { data, error } = await supabase
        .from("grades")
        .update({
          class_id: grade.class_id,
          daily_score: grade.daily_score,
          exam_score: grade.exam_score,
          final_score: grade.final_score,
          task_score: grade.task_score,
          teacher_note: grade.teacher_note,
        })
        .eq("id", existingGrade.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Gagal memperbarui nilai: ${error.message}`);
      }

      savedGrades.push(data);
    } else {
      const { data, error } = await supabase
        .from("grades")
        .insert(grade)
        .select()
        .single();

      if (error) {
        throw new Error(`Gagal menyimpan nilai baru: ${error.message}`);
      }

      savedGrades.push(data);
    }
  }

  return savedGrades;
}

export async function createGrade(data: GradeInsert) {
  const supabase = requireSupabase();
  const { data: grade, error } = await supabase.from("grades").insert(data).select().single();

  if (error) {
    throw new Error(`Gagal menambah nilai: ${error.message}`);
  }

  return grade;
}

export async function updateGrade(id: string, data: GradeUpdate) {
  const supabase = requireSupabase();
  const { data: grade, error } = await supabase
    .from("grades")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui nilai: ${error.message}`);
  }

  return grade;
}

export async function deleteGrade(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("grades").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus nilai: ${error.message}`);
  }

  return true;
}

export async function getGradesByStudentId(studentId: string) {
  return getGradesByStudent(studentId);
}
