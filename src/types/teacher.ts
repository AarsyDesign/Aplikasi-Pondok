export type TeacherStatus = "aktif" | "nonaktif";

export type Teacher = {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  status: TeacherStatus;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TeacherFormData = {
  full_name: string;
  phone: string;
  address: string;
  status: TeacherStatus;
};
