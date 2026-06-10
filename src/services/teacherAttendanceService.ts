import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getActiveTeachers } from "@/services/teacherService";
import { TeacherAttendance as TeacherAttendanceRow } from "@/types/database";
import {
  TeacherAttendance,
  TeacherAttendanceInput,
  TeacherAttendanceSummary,
} from "@/types/teacherAttendance";

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

async function getTeacherNameMap() {
  const teachers = await getActiveTeachers();
  return new Map(teachers.map((teacher) => [teacher.id, teacher.full_name]));
}

function mapAttendance(
  row: TeacherAttendanceRow,
  teacherNames: Map<string, string>,
): TeacherAttendance {
  return {
    id: row.id,
    teacher_id: row.teacher_id,
    teacherName: row.teacher_id
      ? (teacherNames.get(row.teacher_id) ?? "Guru tidak ditemukan")
      : "-",
    attendance_date: row.attendance_date,
    status: row.status,
    note: row.note,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getTeacherAttendancesByDate(date: string) {
  const supabase = requireSupabase();
  const [teacherNames, attendancesResult] = await Promise.all([
    getTeacherNameMap(),
    supabase
      .from("teacher_attendances")
      .select("*")
      .eq("attendance_date", date)
      .order("created_at"),
  ]);

  const { data, error } = attendancesResult;

  if (error) {
    throw new Error(`Gagal mengambil absensi guru: ${error.message}`);
  }

  return data.map((attendance) => mapAttendance(attendance, teacherNames));
}

export async function upsertTeacherAttendances(attendances: TeacherAttendanceInput[]) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("teacher_attendances")
    .upsert(attendances, {
      onConflict: "teacher_id,attendance_date",
    })
    .select();

  if (error) {
    throw new Error(`Gagal menyimpan absensi guru: ${error.message}`);
  }

  return data;
}

export async function getTeacherAttendanceSummaryByDate(
  date: string,
): Promise<TeacherAttendanceSummary> {
  const [teachers, attendances] = await Promise.all([
    getActiveTeachers(),
    getTeacherAttendancesByDate(date),
  ]);

  return attendances.reduce<TeacherAttendanceSummary>(
    (summary, attendance) => ({
      ...summary,
      [attendance.status]: summary[attendance.status] + 1,
    }),
    {
      total: teachers.length,
      hadir: 0,
      izin: 0,
      sakit: 0,
      alfa: 0,
    },
  );
}

export async function deleteTeacherAttendance(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("teacher_attendances").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus absensi guru: ${error.message}`);
  }

  return true;
}
