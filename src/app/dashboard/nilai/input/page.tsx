import { NilaiForm } from "@/components/nilai/NilaiForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default function InputNilaiPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Pilih kelas, santri, tahun ajaran, dan semester untuk mengisi nilai."
        title="Input Nilai"
      />
      <NilaiForm />
    </div>
  );
}
