import { Grade } from "@/types/grade";
import { InstitutionProfile } from "@/types/institution";
import { Student } from "@/types/student";

export type Report = {
  id: string;
  student: Student;
  semesterId: string;
  semester: string;
  academicYearId: string;
  academicYear: string;
  grades: Grade[];
  note: string;
  homeroomTeacher: string;
  mudir: string;
  publishedAt: string;
  institution: InstitutionProfile;
};
