import { LogoutButton } from "@/components/auth/LogoutButton";
import { roleLabels, type UserRole } from "@/types/profile";

export function Topbar({
  email,
  fullName,
  role,
}: {
  email: string;
  fullName: string | null;
  role: UserRole | null;
}) {
  const displayName = fullName ?? email;
  const displayRole = role ? roleLabels[role] : "Profil belum diatur";

  return (
    <header className="no-print sticky top-0 z-10 border-b border-slate-200 bg-[#f6f7f5]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Tahun Ajaran 2026/2027
          </p>
          <p className="text-xs text-slate-500">Semester Ganjil</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="font-medium text-slate-700">{displayName}</p>
            <p className="text-xs text-slate-500">{displayRole}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
