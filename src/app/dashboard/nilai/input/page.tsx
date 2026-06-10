import { NilaiForm } from "@/components/nilai/NilaiForm";

export default function InputNilaiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Input Nilai</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pilih kelas, santri, tahun ajaran, dan semester untuk mengisi nilai.
        </p>
      </div>
      <NilaiForm />
    </div>
  );
}
