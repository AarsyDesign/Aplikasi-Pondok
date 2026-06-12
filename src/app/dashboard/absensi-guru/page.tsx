"use client";

import { useEffect, useState } from "react";
import { AbsensiGuruForm } from "@/components/absensi/AbsensiGuruForm";
import { AbsensiGuruTable } from "@/components/absensi/AbsensiGuruTable";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getTeacherAttendancesByDate,
  getTeacherAttendanceSummaryByDate,
} from "@/services/teacherAttendanceService";
import {
  TeacherAttendance,
  TeacherAttendanceSummary,
} from "@/types/teacherAttendance";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function AbsensiGuruPage() {
  const [date, setDate] = useState(getToday);
  const [attendances, setAttendances] = useState<TeacherAttendance[]>([]);
  const [summary, setSummary] = useState<TeacherAttendanceSummary>({
    total: 0,
    hadir: 0,
    izin: 0,
    sakit: 0,
    alfa: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  function loadAttendanceData(selectedDate: string) {
    setIsLoading(true);
    setError("");

    Promise.all([
      getTeacherAttendancesByDate(selectedDate),
      getTeacherAttendanceSummaryByDate(selectedDate),
    ])
      .then(([attendanceData, summaryData]) => {
        setAttendances(attendanceData);
        setSummary(summaryData);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat absensi guru.");
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let isActive = true;

    Promise.all([getTeacherAttendancesByDate(date), getTeacherAttendanceSummaryByDate(date)])
      .then(([attendanceData, summaryData]) => {
        if (!isActive) {
          return;
        }

        setAttendances(attendanceData);
        setSummary(summaryData);
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

  return (
    <div className="space-y-6">
      <PageHeader
        description="Catat dan lihat rekap kehadiran guru per tanggal."
        title="Absensi Guru"
      />

      <Card>
        <label className="block max-w-xs text-sm font-semibold text-slate-700">
          Tanggal Absensi
          <input
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total guru", summary.total],
          ["Hadir", summary.hadir],
          ["Izin", summary.izin],
          ["Sakit", summary.sakit],
          ["Alfa", summary.alfa],
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          </Card>
        ))}
      </section>

      {error ? <Alert variant="danger">{error}</Alert> : null}

      <AbsensiGuruForm date={date} onSaved={() => loadAttendanceData(date)} />

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-950">Rekap Absensi</h2>
        {isLoading ? (
          <LoadingState message="Memuat rekap absensi..." />
        ) : (
          <AbsensiGuruTable attendances={attendances} />
        )}
      </div>
    </div>
  );
}
