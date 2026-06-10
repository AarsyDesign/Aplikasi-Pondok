import { SupabaseStatusCard } from "@/components/dashboard/SupabaseStatusCard";
import { Card } from "@/components/ui/Card";
import { getClasses } from "@/services/classService";
import { getGrades } from "@/services/gradeService";
import { getStudents } from "@/services/studentService";
import { getSubjects } from "@/services/subjectService";

export default async function DashboardPage() {
  const [students, classes, subjects, grades] = await Promise.all([
    getStudents().catch(() => []),
    getClasses().catch(() => []),
    getSubjects().catch(() => []),
    getGrades().catch(() => []),
  ]);

  const stats = [
    { label: "Total Santri", value: students.length },
    { label: "Kelas / Marhalah", value: classes.length },
    { label: "Mata Pelajaran", value: subjects.length },
    { label: "Nilai Terinput", value: grades.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ringkasan awal pengelolaan raport santri.
        </p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {item.value}
            </p>
          </Card>
        ))}
      </section>
      <Card>
        <h2 className="text-lg font-semibold text-slate-950">
          Aktivitas Terbaru
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Belum ada aktivitas nyata. Area ini disiapkan untuk ringkasan input
          nilai, validasi wali kelas, dan status cetak raport.
        </p>
      </Card>
      <SupabaseStatusCard />
    </div>
  );
}
