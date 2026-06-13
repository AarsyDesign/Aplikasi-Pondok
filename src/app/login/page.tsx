import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_INSTITUTION_PROFILE } from "@/types/institution";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  let institutionName =
    DEFAULT_INSTITUTION_PROFILE.short_name || DEFAULT_INSTITUTION_PROFILE.name;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }

    const { data: institutionProfile } = await supabase
      .from("institution_profile")
      .select("name, short_name")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    institutionName =
      institutionProfile?.short_name ||
      institutionProfile?.name ||
      institutionName;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            {institutionName}
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
