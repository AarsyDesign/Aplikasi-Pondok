import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { InstitutionProfile, InstitutionProfileFormData } from "@/types/institution";

type InstitutionProfileInsert = Database["public"]["Tables"]["institution_profile"]["Insert"];
type InstitutionProfileUpdate = Database["public"]["Tables"]["institution_profile"]["Update"];

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

function cleanProfileData(data: InstitutionProfileFormData): InstitutionProfileInsert {
  const name = data.name.trim();

  if (!name) {
    throw new Error("Nama lembaga wajib diisi.");
  }

  return {
    address: data.address.trim() || null,
    city: data.city.trim() || null,
    default_homeroom_teacher_name: data.default_homeroom_teacher_name.trim() || null,
    default_report_note: data.default_report_note.trim() || null,
    email: data.email.trim() || null,
    headmaster_name: data.headmaster_name.trim() || null,
    name,
    phone: data.phone.trim() || null,
    short_name: data.short_name.trim() || null,
  };
}

export async function getInstitutionProfile(): Promise<InstitutionProfile | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("institution_profile")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Gagal mengambil profil lembaga: ${error.message}`);
  return data;
}

export async function updateInstitutionProfile(id: string, data: InstitutionProfileFormData) {
  const supabase = requireSupabase();
  const payload = cleanProfileData(data) as InstitutionProfileUpdate;
  const { data: profile, error } = await supabase
    .from("institution_profile")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal memperbarui profil lembaga: ${error.message}`);
  return profile;
}

export async function upsertInstitutionProfile(data: InstitutionProfileFormData) {
  const existingProfile = await getInstitutionProfile();

  // Aplikasi MVP hanya memakai satu profil lembaga; jika ada data ganda karena input manual,
  // data paling awal dipakai dan diperbarui agar perilakunya konsisten.
  if (existingProfile) {
    return updateInstitutionProfile(existingProfile.id, data);
  }

  const supabase = requireSupabase();
  const payload = cleanProfileData(data);
  const { data: profile, error } = await supabase
    .from("institution_profile")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`Gagal menyimpan profil lembaga: ${error.message}`);
  return profile;
}
