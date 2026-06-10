"use client";

import { TeacherAttendance } from "@/types/teacherAttendance";

export function AbsensiGuruTable({ attendances }: { attendances: TeacherAttendance[] }) {
  if (attendances.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        Belum ada data absensi pada tanggal ini.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["No", "Nama Guru", "Tanggal", "Status", "Catatan"].map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold text-slate-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendances.map((attendance, index) => (
              <tr key={attendance.id}>
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{attendance.teacherName}</td>
                <td className="px-4 py-3 text-slate-700">{attendance.attendance_date}</td>
                <td className="px-4 py-3 text-slate-700">{attendance.status}</td>
                <td className="px-4 py-3 text-slate-700">{attendance.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
