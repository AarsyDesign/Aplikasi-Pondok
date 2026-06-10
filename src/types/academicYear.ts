export type AcademicYear = {
  id: string;
  name: string;
  is_active: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AcademicYearFormData = {
  name: string;
};
