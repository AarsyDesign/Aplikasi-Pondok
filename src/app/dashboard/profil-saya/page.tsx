import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { formatRoleLabel } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUserRole } from "@/types/profile";

export default async function MyProfilePage() {
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
    .select("full_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = profile && isUserRole(profile.role) ? profile.role : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-600">
          Informasi dasar pengguna yang sedang login.
        </p>
      </div>

      <Card>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Nama pengguna</dt>
            <dd className="mt-1 text-slate-950">
              {profile?.full_name ?? "Profil pengguna belum lengkap"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Email login</dt>
            <dd className="mt-1 text-slate-950">{user.email ?? "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Role</dt>
            <dd className="mt-1 text-slate-950">
              {formatRoleLabel(role)}
            </dd>
          </div>
        </dl>

        {!profile || !role ? (
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Profil pengguna belum lengkap. Hubungi admin.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
