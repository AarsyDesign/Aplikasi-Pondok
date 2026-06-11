import { redirect } from "next/navigation";
import { UserProfileTable } from "@/components/pengaturan/UserProfileTable";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUserRole } from "@/types/profile";

export default async function UserManagementPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = profile && isUserRole(profile.role) ? profile.role : null;

  if (role !== "admin") {
    redirect("/dashboard/akses-ditolak");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">
          Manajemen Pengguna
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
          Akun login dibuat melalui Supabase Authentication. Halaman ini hanya
          mengatur profil dan role pengguna aplikasi.
        </p>
      </div>

      <UserProfileTable currentUserId={user.id} />
    </div>
  );
}
