export type Semester = {
  id: string;
  name: string;
  academic_year_id: string | null;
  academicYearName: string;
  is_active: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SemesterFormData = {
  name: string;
  academic_year_id: string;
};
