"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { TeacherAttendance } from "@/types/teacherAttendance";

export function AbsensiGuruTable({ attendances }: { attendances: TeacherAttendance[] }) {
  if (attendances.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
        Belum ada data absensi pada tanggal ini.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {["No", "Nama Guru", "Tanggal", "Status", "Catatan"].map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendances.map((attendance, index) => (
              <tr key={attendance.id} className="transition hover:bg-emerald-50/40">
                <td className="px-4 py-3.5 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-950">{attendance.teacherName}</td>
                <td className="px-4 py-3.5 text-slate-700">{attendance.attendance_date}</td>
                <td className="px-4 py-3.5"><StatusBadge status={attendance.status} /></td>
                <td className="px-4 py-3.5 text-slate-700">{attendance.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
