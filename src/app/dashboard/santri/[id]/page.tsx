import { SantriDetail } from "@/components/santri/SantriDetail";

export default async function DetailSantriPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Detail Santri</h1>
        <p className="mt-1 text-sm text-slate-600">
          Lihat, ubah, atau hapus data santri.
        </p>
      </div>
      <SantriDetail id={id} />
    </div>
  );
}
