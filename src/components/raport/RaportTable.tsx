import { Grade } from "@/types/grade";

function formatScore(value: number | null) {
  return value ?? "-";
}

function getSummary(grades: Grade[]) {
  const finalScores = grades
    .map((grade) => grade.final_score)
    .filter((score): score is number => typeof score === "number");

  if (finalScores.length === 0) {
    return {
      average: "-",
      highest: "-",
      lowest: "-",
      subjectCount: grades.length,
    };
  }

  const total = finalScores.reduce((sum, score) => sum + score, 0);
  const average = total / finalScores.length;

  return {
    average: Number.isInteger(average) ? String(average) : average.toFixed(2),
    highest: String(Math.max(...finalScores)),
    lowest: String(Math.min(...finalScores)),
    subjectCount: grades.length,
  };
}

export function RaportTable({ grades }: { grades: Grade[] }) {
  const summary = getSummary(grades);

  return (
    <>
      <table className="mt-7 w-full border-collapse text-[12px] leading-relaxed">
        <thead>
          <tr className="bg-slate-100">
            <th className="w-10 border border-slate-500 px-2 py-2 text-center">No</th>
            <th className="border border-slate-500 px-3 py-2 text-left">Mata Pelajaran</th>
            <th className="border border-slate-500 px-2 py-2 text-center">Nilai Harian</th>
            <th className="border border-slate-500 px-2 py-2 text-center">Nilai Tugas</th>
            <th className="border border-slate-500 px-2 py-2 text-center">Nilai Ujian</th>
            <th className="border border-slate-500 px-2 py-2 text-center">Nilai Akhir</th>
            <th className="border border-slate-500 px-3 py-2 text-left">Catatan Guru</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr className="break-inside-avoid" key={grade.id}>
              <td className="border border-slate-500 px-2 py-2 text-center">{index + 1}</td>
              <td className="border border-slate-500 px-3 py-2 font-medium">{grade.subjectName}</td>
              <td className="border border-slate-500 px-2 py-2 text-center">
                {formatScore(grade.daily_score)}
              </td>
              <td className="border border-slate-500 px-2 py-2 text-center">
                {formatScore(grade.task_score)}
              </td>
              <td className="border border-slate-500 px-2 py-2 text-center">
                {formatScore(grade.exam_score)}
              </td>
              <td className="border border-slate-500 px-2 py-2 text-center font-semibold">
                {formatScore(grade.final_score)}
              </td>
              <td className="border border-slate-500 px-3 py-2">
                {grade.teacher_note ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <div className="border border-slate-400 p-3">
          <p className="text-slate-600">Jumlah mata pelajaran</p>
          <p className="mt-1 text-lg font-semibold">{summary.subjectCount}</p>
        </div>
        <div className="border border-slate-400 p-3">
          <p className="text-slate-600">Rata-rata nilai akhir</p>
          <p className="mt-1 text-lg font-semibold">{summary.average}</p>
        </div>
        <div className="border border-slate-400 p-3">
          <p className="text-slate-600">Nilai tertinggi</p>
          <p className="mt-1 text-lg font-semibold">{summary.highest}</p>
        </div>
        <div className="border border-slate-400 p-3">
          <p className="text-slate-600">Nilai terendah</p>
          <p className="mt-1 text-lg font-semibold">{summary.lowest}</p>
        </div>
      </section>
    </>
  );
}
