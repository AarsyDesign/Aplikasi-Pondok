import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database, Semester as SemesterRow } from "@/types/database";
import { Semester, SemesterFormData } from "@/types/semester";

type SemesterInsert = Database["public"]["Tables"]["semesters"]["Insert"];
type SemesterUpdate = Database["public"]["Tables"]["semesters"]["Update"];

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

function validateSemester(data: SemesterFormData) {
  const name = data.name.trim();

  if (!name) {
    throw new Error("Nama semester wajib diisi.");
  }

  if (!data.academic_year_id) {
    throw new Error("Tahun ajaran wajib dipilih.");
  }

  return { academic_year_id: data.academic_year_id, name };
}

async function ensureSemesterAvailable(name: string, academicYearId: string, excludeId?: string) {
  const supabase = requireSupabase();
  let query = supabase
    .from("semesters")
    .select("id")
    .ilike("name", name)
    .eq("academic_year_id", academicYearId)
    .limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal memeriksa duplikasi semester: ${error.message}`);
  }

  if (data.length > 0) {
    throw new Error("Semester untuk tahun ajaran ini sudah ada.");
  }
}

async function getAcademicYearNames() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("academic_years").select("id, name");

  if (error) throw new Error(`Gagal mengambil tahun ajaran: ${error.message}`);
  return new Map(data.map((item) => [item.id, item.name]));
}

async function mapSemesters(rows: SemesterRow[]): Promise<Semester[]> {
  const academicYearNames = await getAcademicYearNames();

  return rows.map((row) => ({
    academicYearName: row.academic_year_id ? (academicYearNames.get(row.academic_year_id) ?? "-") : "-",
    academic_year_id: row.academic_year_id,
    created_at: row.created_at,
    id: row.id,
    is_active: row.is_active,
    name: row.name,
    updated_at: row.updated_at,
  }));
}

export async function getSemesters(): Promise<Semester[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("semesters")
    .select("*")
    .order("academic_year_id")
    .order("name");

  if (error) throw new Error(`Gagal mengambil semester: ${error.message}`);
  return mapSemesters(data);
}

export async function getSemestersByAcademicYear(academicYearId: string): Promise<Semester[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("semesters")
    .select("*")
    .eq("academic_year_id", academicYearId)
    .order("name");

  if (error) throw new Error(`Gagal mengambil semester: ${error.message}`);
  return mapSemesters(data);
}

export async function getActiveSemester(academicYearId?: string): Promise<Semester | null> {
  const supabase = requireSupabase();
  let query = supabase.from("semesters").select("*").eq("is_active", true);

  if (academicYearId) {
    query = query.eq("academic_year_id", academicYearId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) throw new Error(`Gagal mengambil semester aktif: ${error.message}`);
  if (!data) return null;
  return (await mapSemesters([data]))[0];
}

export async function createSemester(data: SemesterFormData) {
  const supabase = requireSupabase();
  const cleanData = validateSemester(data);
  await ensureSemesterAvailable(cleanData.name, cleanData.academic_year_id);
  const payload: SemesterInsert = {
    academic_year_id: cleanData.academic_year_id,
    is_active: false,
    name: cleanData.name,
  };
  const { data: semester, error } = await supabase
    .from("semesters")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`Gagal menambah semester: ${error.message}`);
  return semester;
}

export async function updateSemester(id: string, data: SemesterFormData) {
  const supabase = requireSupabase();
  const cleanData = validateSemester(data);
  await ensureSemesterAvailable(cleanData.name, cleanData.academic_year_id, id);
  const payload: SemesterUpdate = {
    academic_year_id: cleanData.academic_year_id,
    name: cleanData.name,
  };
  const { data: semester, error } = await supabase
    .from("semesters")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal memperbarui semester: ${error.message}`);
  return semester;
}

export async function activateSemester(id: string, academicYearId: string) {
  const supabase = requireSupabase();
  const { error: deactivateError } = await supabase
    .from("semesters")
    .update({ is_active: false })
    .eq("academic_year_id", academicYearId)
    .neq("id", id);

  if (deactivateError) throw new Error(`Gagal menonaktifkan semester lain: ${deactivateError.message}`);

  const { error: activateError } = await supabase
    .from("semesters")
    .update({ is_active: true })
    .eq("id", id);

  if (activateError) throw new Error(`Gagal mengaktifkan semester: ${activateError.message}`);
  return true;
}

export async function deleteSemester(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("semesters").delete().eq("id", id);

  if (error) {
    throw new Error("Data tidak bisa dihapus karena masih digunakan oleh data lain.");
  }

  return true;
}
