import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { AcademicYear, AcademicYearFormData } from "@/types/academicYear";

type AcademicYearInsert = Database["public"]["Tables"]["academic_years"]["Insert"];
type AcademicYearUpdate = Database["public"]["Tables"]["academic_years"]["Update"];

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

function validateAcademicYear(data: AcademicYearFormData) {
  const name = data.name.trim();

  if (!name) {
    throw new Error("Tahun ajaran wajib diisi.");
  }

  if (name.length < 4) {
    throw new Error("Tahun ajaran minimal 4 karakter.");
  }

  return name;
}

async function ensureAcademicYearNameAvailable(name: string, excludeId?: string) {
  const supabase = requireSupabase();
  let query = supabase.from("academic_years").select("id").ilike("name", name).limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal memeriksa duplikasi tahun ajaran: ${error.message}`);
  }

  if (data.length > 0) {
    throw new Error("Tahun ajaran sudah ada.");
  }
}

export async function getAcademicYears(): Promise<AcademicYear[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("academic_years")
    .select("*")
    .order("name", { ascending: false });

  if (error) throw new Error(`Gagal mengambil tahun ajaran: ${error.message}`);
  return data;
}

export async function getActiveAcademicYear(): Promise<AcademicYear | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("academic_years")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Gagal mengambil tahun ajaran aktif: ${error.message}`);
  return data;
}

export async function createAcademicYear(data: AcademicYearFormData) {
  const supabase = requireSupabase();
  const name = validateAcademicYear(data);
  await ensureAcademicYearNameAvailable(name);
  const payload: AcademicYearInsert = {
    is_active: false,
    name,
  };
  const { data: academicYear, error } = await supabase
    .from("academic_years")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`Gagal menambah tahun ajaran: ${error.message}`);
  return academicYear;
}

export async function updateAcademicYear(id: string, data: AcademicYearFormData) {
  const supabase = requireSupabase();
  const name = validateAcademicYear(data);
  await ensureAcademicYearNameAvailable(name, id);
  const payload: AcademicYearUpdate = {
    name,
  };
  const { data: academicYear, error } = await supabase
    .from("academic_years")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal memperbarui tahun ajaran: ${error.message}`);
  return academicYear;
}

export async function activateAcademicYear(id: string) {
  const supabase = requireSupabase();
  const { error: deactivateError } = await supabase
    .from("academic_years")
    .update({ is_active: false })
    .neq("id", id);

  if (deactivateError) throw new Error(`Gagal menonaktifkan tahun ajaran lain: ${deactivateError.message}`);

  const { error: activateError } = await supabase
    .from("academic_years")
    .update({ is_active: true })
    .eq("id", id);

  if (activateError) throw new Error(`Gagal mengaktifkan tahun ajaran: ${activateError.message}`);
  return true;
}

export async function deleteAcademicYear(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("academic_years").delete().eq("id", id);

  if (error) {
    throw new Error("Data tidak bisa dihapus karena masih digunakan oleh data lain.");
  }

  return true;
}
