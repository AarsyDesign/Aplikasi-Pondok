"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
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
  status: TeacherAttendanceStatus | "";
  note: string;
};

type AbsensiGuruFormProps = {
  date: string;
  onSaved: () => void;
};

const statusOptions: Array<{ label: string; value: TeacherAttendanceStatus | "" }> = [
  { label: "Pilih status", value: "" },
  { label: "hadir", value: "hadir" },
  { label: "izin", value: "izin" },
  { label: "sakit", value: "sakit" },
  { label: "alfa", value: "alfa" },
];

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
              status: existingAttendance?.status ?? "hadir",
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

  function updateRow(teacherId: string, field: keyof AttendanceRow, value: string) {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.teacher_id === teacherId ? { ...row, [field]: value } : row,
      ),
    );
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    const invalidRow = rows.find((row) => !row.status);

    if (invalidRow) {
      setError(`Status absensi ${teacherNameMap.get(invalidRow.teacher_id) ?? "guru"} wajib dipilih.`);
      return;
    }

    const payload: TeacherAttendanceInput[] = rows.map((row) => ({
      attendance_date: date,
      id: row.id,
      note: row.note.trim() || null,
      status: row.status || "hadir",
      teacher_id: row.teacher_id,
    }));

    try {
      setIsSaving(true);
      await upsertTeacherAttendances(payload);
      setSuccess("Absensi guru berhasil disimpan.");
      onSaved();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan absensi guru.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Memuat daftar guru...
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada guru aktif. Tambahkan data guru terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Nama Guru</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.teacher_id}>
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {teacherNameMap.get(row.teacher_id) ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="h-10 w-40 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                      value={row.status}
                      onChange={(event) => updateRow(row.teacher_id, "status", event.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      className="h-10 w-72 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Catatan"
                      value={row.note}
                      onChange={(event) => updateRow(row.teacher_id, "note", event.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 p-4">
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Absensi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
