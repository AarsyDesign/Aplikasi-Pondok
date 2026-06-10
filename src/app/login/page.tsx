import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-950">Login Admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Placeholder autentikasi. Supabase Auth akan ditambahkan pada tahap
          berikutnya.
        </p>
        <form className="mt-6 space-y-4">
          <Input label="Email" type="email" placeholder="admin@pesantren.test" />
          <Input label="Kata Sandi" type="password" placeholder="********" />
          <Button asChild className="w-full">
            <Link href="/dashboard">Masuk</Link>
          </Button>
        </form>
      </Card>
    </main>
  );
}
