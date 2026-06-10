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
  created_at?: string | null;
  updated_at?: string | null;
};

export type InstitutionProfileFormData = {
  name: string;
  short_name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  headmaster_name: string;
  default_homeroom_teacher_name: string;
  default_report_note: string;
};

export const DEFAULT_REPORT_NOTE =
  "Semoga ananda semakin semangat dalam menuntut ilmu, memperbaiki adab, dan menjaga keistiqamahan dalam kebaikan.";

export const DEFAULT_INSTITUTION_PROFILE: InstitutionProfile = {
  address: null,
  city: "Pontianak",
  created_at: null,
  default_homeroom_teacher_name: "Wali Kelas",
  default_report_note: DEFAULT_REPORT_NOTE,
  email: null,
  headmaster_name: "Mudir",
  id: "default",
  name: "MA'HAD TAQRIIBUSSUNNAH",
  phone: null,
  short_name: "Taqriibussunnah",
  updated_at: null,
};
