import { SupabaseStatusCard } from "@/components/dashboard/SupabaseStatusCard";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Ringkasan awal pengelolaan raport santri.
        </p>
      </div>
      <Card>
        <h2 className="text-lg font-semibold text-slate-950">
          Selamat Datang
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Halaman dashboard utama siap dibuka di production tanpa mengambil data
          Supabase terlebih dahulu.
        </p>
      </Card>
      <SupabaseStatusCard />
    </div>
  );
}
