import { Card } from "@/components/ui/Card";

export default function AboutApplicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">
          Tentang Aplikasi
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Informasi singkat aplikasi internal lembaga.
        </p>
      </div>

      <Card>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Nama aplikasi</dt>
            <dd className="mt-1 text-slate-950">Santri Report App</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Versi</dt>
            <dd className="mt-1 text-slate-950">v1.0.0</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Deskripsi</dt>
            <dd className="mt-1 text-slate-950">
              Aplikasi internal untuk pengelolaan raport santri, absensi guru,
              dan SPP.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Catatan</dt>
            <dd className="mt-1 text-slate-950">
              Aplikasi ini digunakan untuk kebutuhan internal lembaga.
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
