export type Profile = {
  id: string;
  user_id: string | null;
  full_name: string;
  role: string;
  created_at: string | null;
  updated_at: string | null;
};

export type Class = {
  id: string;
  name: string;
  level: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Student = {
  id: string;
  nis: string | null;
  full_name: string;
  gender: "laki-laki" | "perempuan" | null;
  birth_place: string | null;
  birth_date: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  address: string | null;
  class_id: string | null;
  status: "aktif" | "nonaktif" | "lulus" | "pindah";
  created_at: string | null;
  updated_at: string | null;
};

export type Subject = {
  id: string;
  name: string;
  class_id: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AcademicYear = {
  id: string;
  name: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Semester = {
  id: string;
  name: string;
  academic_year_id: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Grade = {
  id: string;
  student_id: string | null;
  class_id: string | null;
  subject_id: string | null;
  semester_id: string | null;
  academic_year_id: string | null;
  daily_score: number | null;
  task_score: number | null;
  exam_score: number | null;
  final_score: number | null;
  teacher_note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Teacher = {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  status: "aktif" | "nonaktif";
  created_at: string | null;
  updated_at: string | null;
};

export type TeacherAttendance = {
  id: string;
  teacher_id: string | null;
  attendance_date: string;
  status: "hadir" | "izin" | "sakit" | "alfa";
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SppBill = {
  id: string;
  student_id: string | null;
  class_id: string | null;
  bill_month: number;
  bill_year: number;
  amount: number;
  status: "belum_bayar" | "sebagian" | "lunas";
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SppPayment = {
  id: string;
  bill_id: string | null;
  student_id: string | null;
  payment_date: string;
  amount_paid: number;
  payment_method: string | null;
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type InstitutionProfile = {
  id: string;
  name: string;
  short_name: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  headmaster_name: string | null;
  default_homeroom_teacher_name: string | null;
  default_report_note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type TableDefinition<Row> = {
  Row: Row;
  Insert: Partial<Omit<Row, "id" | "created_at" | "updated_at">> & {
    id?: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: Partial<Omit<Row, "id" | "created_at" | "updated_at">> & {
    updated_at?: string | null;
  };
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDefinition<Profile>;
      classes: TableDefinition<Class>;
      students: TableDefinition<Student>;
      subjects: TableDefinition<Subject>;
      academic_years: TableDefinition<AcademicYear>;
      semesters: TableDefinition<Semester>;
      grades: TableDefinition<Grade>;
      teachers: TableDefinition<Teacher>;
      teacher_attendances: TableDefinition<TeacherAttendance>;
      spp_bills: TableDefinition<SppBill>;
      spp_payments: TableDefinition<SppPayment>;
      institution_profile: TableDefinition<InstitutionProfile>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
