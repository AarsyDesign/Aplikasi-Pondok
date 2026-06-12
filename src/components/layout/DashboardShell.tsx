import { DashboardRouteGuard } from "@/components/layout/DashboardRouteGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { UserRole } from "@/types/profile";

type DashboardShellProps = {
  children: React.ReactNode;
  institutionName: string;
  userEmail: string;
  profile: {
    full_name: string;
    role: UserRole;
  } | null;
};

export function DashboardShell({
  children,
  institutionName,
  userEmail,
  profile,
}: DashboardShellProps) {
  const role = profile?.role ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar institutionName={institutionName} role={role} />
      <div className="lg:pl-72">
        <Topbar
          email={userEmail}
          fullName={profile?.full_name ?? null}
          role={role}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <DashboardRouteGuard role={role}>{children}</DashboardRouteGuard>
        </main>
      </div>
    </div>
  );
}
