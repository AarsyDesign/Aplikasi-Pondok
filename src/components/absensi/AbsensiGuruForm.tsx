"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getActiveTeachers } from "@/services/teacherService";
import {
  getTeacherAttendancesByDate,
  upsertTeacherAttendances,
} from "@/services/teacherAttendanceService";
import { Teacher } from "@/types/teacher";
import { TeacherAttendanceInput, TeacherAttendanceStatus } from "@/types/teacherAttendance";

type AttendanceRow = {
  id?: string;
  teacher_id: string;
  status: TeacherAttendanceStatus | null;
  note: string;
};

type AbsensiGuruFormProps = {
  date: string;
  onSaved: () => void;
};

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export function AbsensiGuruForm({ date, onSaved }: AbsensiGuruFormProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isActive = true;

    Promise.all([getActiveTeachers(), getTeacherAttendancesByDate(date)])
      .then(([teacherData, attendanceData]) => {
        if (!isActive) {
          return;
        }

        const attendanceMap = new Map(attendanceData.map((attendance) => [attendance.teacher_id, attendance]));
        setTeachers(teacherData);
        setRows(
          teacherData.map((teacher) => {
            const existingAttendance = attendanceMap.get(teacher.id);

            return {
              id: existingAttendance?.id,
              note: existingAttendance?.note ?? "",
              status: existingAttendance?.status ?? null,
              teacher_id: teacher.id,
            };
          }),
        );
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat absensi guru.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [date]);

  const teacherNameMap = useMemo(
    () => new Map(teachers.map((teacher) => [teacher.id, teacher.full_name])),
    [teachers],
  );

  async function saveRows(nextRows: AttendanceRow[], successMessage: string) {
    setError("");
    setSuccess("");

    const changedRows = nextRows.filter((row) => row.status);

    if (changedRows.length === 0) {
      setError("Pilih minimal satu tombol absensi sebelum menyimpan.");
      return;
    }

    const payload: TeacherAttendanceInput[] = changedRows.map((row) => ({
      attendance_date: date,
      id: row.id,
      note: row.note.trim() || null,
      status: row.status ?? "hadir",
      teacher_id: row.teacher_id,
    }));

    try {
      setIsSaving(true);
      await upsertTeacherAttendances(payload);
      setRows(nextRows);
      setSuccess(successMessage);
      onSaved();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan absensi guru.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMarkAttendance(
    teacherId: string,
    status: TeacherAttendanceStatus,
  ) {
    const timeLabel = getCurrentTimeLabel();
    const note =
      status === "hadir"
        ? `Hadir pukul ${timeLabel}`
        : status === "izin"
          ? `Izin dicatat pukul ${timeLabel}`
          : status === "sakit"
            ? `Sakit dicatat pukul ${timeLabel}`
            : `Alfa dicatat pukul ${timeLabel}`;
    const teacherName = teacherNameMap.get(teacherId) ?? "Guru";
    const nextRows = rows.map((row) =>
      row.teacher_id === teacherId
        ? {
            ...row,
            note,
            status,
          }
        : row,
    );

    await saveRows(nextRows, `Absensi ${teacherName} berhasil dicatat.`);
  }

  if (isLoading) {
    return <LoadingState message="Memuat daftar guru..." />;
  }

  if (teachers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        Belum ada guru aktif. Tambahkan data guru terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}
      <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Nama Guru</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Absensi</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Hasil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.teacher_id} className="transition hover:bg-emerald-50/40">
                  <td className="px-4 py-3.5 font-semibold text-slate-950">
                    {teacherNameMap.get(row.teacher_id) ?? "-"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex min-w-72 flex-wrap gap-2">
                      <Button
                        className="min-h-0 px-3 py-1.5"
                        disabled={isSaving}
                        onClick={() => void handleMarkAttendance(row.teacher_id, "hadir")}
                        type="button"
                      >
                        Hadir Sekarang
                      </Button>
                      <Button
                        className="min-h-0 px-3 py-1.5"
                        disabled={isSaving}
                        onClick={() => void handleMarkAttendance(row.teacher_id, "izin")}
                        type="button"
                        variant="secondary"
                      >
                        Izin
                      </Button>
                      <Button
                        className="min-h-0 px-3 py-1.5"
                        disabled={isSaving}
                        onClick={() => void handleMarkAttendance(row.teacher_id, "sakit")}
                        type="button"
                        variant="secondary"
                      >
                        Sakit
                      </Button>
                      <Button
                        className="min-h-0 px-3 py-1.5"
                        disabled={isSaving}
                        onClick={() => void handleMarkAttendance(row.teacher_id, "alfa")}
                        type="button"
                        variant="danger"
                      >
                        Alfa
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="min-w-56 space-y-2">
                      {row.status ? <StatusBadge status={row.status} /> : null}
                      <p className="text-sm text-slate-600">
                        {row.note || "Belum dicatat."}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
