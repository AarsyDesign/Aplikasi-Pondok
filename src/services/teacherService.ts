import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database, Teacher as TeacherRow } from "@/types/database";
import { Teacher, TeacherFormData } from "@/types/teacher";

type TeacherInsert = Database["public"]["Tables"]["teachers"]["Insert"];
type TeacherUpdate = Database["public"]["Tables"]["teachers"]["Update"];

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

function mapTeacher(row: TeacherRow): Teacher {
  return {
    id: row.id,
    full_name: row.full_name,
    phone: row.phone,
    address: row.address,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function cleanTeacherPayload(data: TeacherFormData): TeacherInsert {
  return {
    address: data.address.trim() || null,
    full_name: data.full_name.trim(),
    phone: data.phone.trim() || null,
    status: data.status,
  };
}

async function ensureTeacherNameAvailable(fullName: string, excludeId?: string) {
  const supabase = requireSupabase();
  let query = supabase.from("teachers").select("id").ilike("full_name", fullName).limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal memeriksa duplikasi guru: ${error.message}`);
  }

  if (data.length > 0) {
    throw new Error("Nama guru sudah digunakan.");
  }
}

function isTeacherFormData(data: TeacherFormData | TeacherInsert | TeacherUpdate): data is TeacherFormData {
  return (
    typeof data.full_name === "string" &&
    typeof data.phone === "string" &&
    typeof data.address === "string" &&
    typeof data.status === "string"
  );
}

export async function getTeachers() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("teachers").select("*").order("full_name");

  if (error) {
    throw new Error(`Gagal mengambil data guru: ${error.message}`);
  }

  return data.map(mapTeacher);
}

export async function getActiveTeachers() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("status", "aktif")
    .order("full_name");

  if (error) {
    throw new Error(`Gagal mengambil data guru aktif: ${error.message}`);
  }

  return data.map(mapTeacher);
}

export async function getTeacherById(id: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil detail guru: ${error.message}`);
  }

  return data ? mapTeacher(data) : undefined;
}

export async function createTeacher(data: TeacherFormData | TeacherInsert) {
  const supabase = requireSupabase();
  const payload = isTeacherFormData(data) ? cleanTeacherPayload(data) : data;
  if (payload.full_name) await ensureTeacherNameAvailable(payload.full_name);
  const { data: teacher, error } = await supabase
    .from("teachers")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menambah guru: ${error.message}`);
  }

  return mapTeacher(teacher);
}

export async function updateTeacher(id: string, data: TeacherFormData | TeacherUpdate) {
  const supabase = requireSupabase();
  const payload = isTeacherFormData(data) ? cleanTeacherPayload(data) : data;
  if (payload.full_name) await ensureTeacherNameAvailable(payload.full_name, id);
  const { data: teacher, error } = await supabase
    .from("teachers")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui guru: ${error.message}`);
  }

  return mapTeacher(teacher);
}

export async function deleteTeacher(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("teachers").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus guru: ${error.message}`);
  }

  return true;
}
