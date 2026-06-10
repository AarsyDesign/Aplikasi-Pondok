import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Pesantren Internal
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Santri Report App
        </h1>
        <p className="mt-4 text-slate-600">
          Struktur awal aplikasi raport santri dengan halaman admin, data
          master, input nilai, dan pratinjau raport.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard">Masuk Dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/login">Halaman Login</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
