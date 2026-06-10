export type GradePredicate = "A" | "B" | "C";

export type Grade = {
  id: string;
  student_id: string | null;
  studentId: string | null;
  studentName: string;
  class_id: string | null;
  classId: string | null;
  className: string;
  subject_id: string | null;
  subjectId: string | null;
  subjectName: string;
  semester_id: string | null;
  semesterId: string | null;
  semesterName: string;
  academic_year_id: string | null;
  academicYearId: string | null;
  academicYearName: string;
  daily_score: number | null;
  task_score: number | null;
  exam_score: number | null;
  final_score: number | null;
  teacher_note: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  score: number;
  predicate: GradePredicate;
  note: string;
};

export type AcademicYearOption = {
  id: string;
  name: string;
  is_active: boolean | null;
};

export type SemesterOption = {
  id: string;
  name: string;
  academic_year_id: string | null;
  is_active: boolean | null;
};

export type GradeInputRow = {
  existingGradeId?: string;
  subject_id: string;
  daily_score: string;
  task_score: string;
  exam_score: string;
  final_score: string;
  teacher_note: string;
};

export type GradeUpsertInput = {
  id?: string;
  student_id: string;
  class_id: string;
  subject_id: string;
  semester_id: string;
  academic_year_id: string;
  daily_score: number | null;
  task_score: number | null;
  exam_score: number | null;
  final_score: number | null;
  teacher_note: string | null;
};
