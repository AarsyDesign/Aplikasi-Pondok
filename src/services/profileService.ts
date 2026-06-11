import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database, Profile as ProfileRow } from "@/types/database";
import type { Profile, ProfileFormData } from "@/types/profile";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type CurrentProfileResult =
  | { status: "authenticated"; profile: Profile; userId: string }
  | { status: "missing_profile"; profile: null; userId: string }
  | { status: "not_authenticated"; profile: null; userId: null };

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    user_id: row.user_id,
    full_name: row.full_name,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function requireSupabase() {
  return createSupabaseBrowserClient();
}

export async function getProfileByUserId(userId: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil profil pengguna: ${error.message}`);
  }

  return data ? mapProfile(data) : null;
}

export async function getCurrentProfile(): Promise<CurrentProfileResult> {
  const supabase = requireSupabase();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "not_authenticated", profile: null, userId: null };
  }

  const profile = await getProfileByUserId(user.id);

  if (!profile) {
    return { status: "missing_profile", profile: null, userId: user.id };
  }

  return { status: "authenticated", profile, userId: user.id };
}

export async function getCurrentUser() {
  const supabase = requireSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Gagal mengambil user login: ${error.message}`);
  }

  return user;
}

export async function createProfile(data: ProfileFormData) {
  const supabase = requireSupabase();
  const payload: ProfileInsert = data;
  const { data: profile, error } = await supabase
    .from("profiles")
    .insert(payload)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("User ID ini sudah memiliki profil.");
    }

    throw new Error(`Gagal membuat profil pengguna: ${error.message}`);
  }

  return mapProfile(profile);
}

export async function updateProfile(id: string, data: Partial<ProfileFormData>) {
  const supabase = requireSupabase();
  const payload: ProfileUpdate = data;
  const { data: profile, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("User ID ini sudah memiliki profil.");
    }

    throw new Error(`Gagal memperbarui profil pengguna: ${error.message}`);
  }

  return mapProfile(profile);
}

export async function getProfiles() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name");

  if (error) {
    throw new Error(`Gagal mengambil daftar profil: ${error.message}`);
  }

  return data.map(mapProfile);
}

export async function deleteProfile(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus profil pengguna: ${error.message}`);
  }

  return true;
}
