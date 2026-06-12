import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Santri Report App
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Login Admin
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Masuk menggunakan akun internal yang sudah dibuat oleh pengelola
            lembaga.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">
          Tidak tersedia register publik. Hubungi admin jika akun belum aktif.
        </p>
      </div>
    </main>
  );
}
