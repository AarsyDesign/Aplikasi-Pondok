import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_INSTITUTION_PROFILE } from "@/types/institution";
import { isUserRole } from "@/types/profile";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const { data: institutionProfile } = await supabase
    .from("institution_profile")
    .select("name, short_name")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const validProfile =
    profile && isUserRole(profile.role)
      ? {
          full_name: profile.full_name,
          role: profile.role,
        }
      : null;

  return (
    <DashboardShell
      institutionName={
        institutionProfile?.short_name ||
        institutionProfile?.name ||
        DEFAULT_INSTITUTION_PROFILE.name
      }
      userEmail={user.email ?? "User"}
      profile={validProfile}
    >
      {children}
    </DashboardShell>
  );
}
