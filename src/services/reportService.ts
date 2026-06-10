import { getAcademicYears, getGradesByStudentAndPeriod, getSemesters } from "@/services/gradeService";
import { getInstitutionProfile } from "@/services/institutionService";
import { getStudentById } from "@/services/studentService";
import { DEFAULT_INSTITUTION_PROFILE } from "@/types/institution";
import { Report } from "@/types/report";

export async function getReportByStudent(
  studentId: string,
  semesterId: string,
  academicYearId: string,
): Promise<Report | undefined> {
  const [student, grades, semesters, academicYears, institutionProfile] = await Promise.all([
    getStudentById(studentId),
    getGradesByStudentAndPeriod(studentId, semesterId, academicYearId),
    getSemesters(),
    getAcademicYears(),
    getInstitutionProfile().catch(() => null),
  ]);

  if (!student) {
    return undefined;
  }

  const semester = semesters.find((item) => item.id === semesterId);
  const academicYear = academicYears.find((item) => item.id === academicYearId);
  const institution = institutionProfile ?? DEFAULT_INSTITUTION_PROFILE;

  return {
    id: `rp-${studentId}-${semesterId}-${academicYearId}`,
    academicYear: academicYear?.name ?? "-",
    academicYearId,
    grades,
    homeroomTeacher: institution.default_homeroom_teacher_name || "Wali Kelas",
    institution,
    mudir: institution.headmaster_name || "Mudir",
    note: institution.default_report_note || DEFAULT_INSTITUTION_PROFILE.default_report_note || "",
    publishedAt: institution.city || "Pontianak",
    semester: semester?.name ?? "-",
    semesterId,
    student,
  };
}

export async function getReportByStudentId(studentId: string) {
  const academicYears = await getAcademicYears();
  const semesters = await getSemesters();
  const activeAcademicYear = academicYears.find((item) => item.is_active) ?? academicYears[0];
  const activeSemester =
    semesters.find((item) => item.academic_year_id === activeAcademicYear?.id && item.is_active) ??
    semesters.find((item) => item.academic_year_id === activeAcademicYear?.id) ??
    semesters[0];

  if (!activeSemester || !activeAcademicYear) {
    return undefined;
  }

  return getReportByStudent(studentId, activeSemester.id, activeAcademicYear.id);
}
