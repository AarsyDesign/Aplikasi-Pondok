export type TeacherAttendanceStatus = "hadir" | "izin" | "sakit" | "alfa";

export type TeacherAttendance = {
  id: string;
  teacher_id: string | null;
  teacherName: string;
  attendance_date: string;
  status: TeacherAttendanceStatus;
  note: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TeacherAttendanceInput = {
  id?: string;
  teacher_id: string;
  attendance_date: string;
  status: TeacherAttendanceStatus;
  note: string | null;
};

export type TeacherAttendanceSummary = {
  total: number;
  hadir: number;
  izin: number;
  sakit: number;
  alfa: number;
};
