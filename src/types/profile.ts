export type UserRole = "admin" | "guru" | "bendahara";

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  role: UserRole;
  created_at: string | null;
  updated_at: string | null;
};

export type ProfileFormData = {
  user_id: string;
  full_name: string;
  role: UserRole;
};

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  guru: "Guru",
  bendahara: "Bendahara",
};

export function isUserRole(value: string | null | undefined): value is UserRole {
  return value === "admin" || value === "guru" || value === "bendahara";
}
