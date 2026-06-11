import { Card } from "@/components/ui/Card";

export default function AccessDeniedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Akses Ditolak</h1>
      </div>
      <Card>
        <p className="text-sm text-slate-700">
          Maaf, Anda tidak memiliki akses ke halaman ini.
        </p>
      </Card>
    </div>
  );
}
