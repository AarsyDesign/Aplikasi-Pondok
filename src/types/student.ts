export type StudentGender = "laki-laki" | "perempuan";
export type StudentStatus = "aktif" | "nonaktif" | "lulus" | "pindah";

export type Student = {
  id: string;
  nis: string | null;
  full_name: string;
  name: string;
  gender: StudentGender | null;
  birth_place: string | null;
  birth_date: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  address: string | null;
  class_id: string | null;
  classId: string | null;
  className: string;
  status: StudentStatus;
};

export type StudentFormData = {
  nis: string;
  full_name: string;
  gender: StudentGender | "";
  birth_place: string;
  birth_date: string;
  guardian_name: string;
  guardian_phone: string;
  address: string;
  class_id: string;
  status: StudentStatus;
};
