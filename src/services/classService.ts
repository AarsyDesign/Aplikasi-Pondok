import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ClassFormData, ClassGroup } from "@/types/class";
import { Class as ClassRow, Database } from "@/types/database";

type ClassInsert = Database["public"]["Tables"]["classes"]["Insert"];
type ClassUpdate = Database["public"]["Tables"]["classes"]["Update"];

export const mockClasses: ClassGroup[] = [
  {
    id: "kl-001",
    name: "Marhalah 1",
    level: "1",
    description: "Data contoh saat Supabase belum dikonfigurasi.",
  },
  {
    id: "kl-002",
    name: "Marhalah 2",
    level: "2",
    description: "Data contoh saat Supabase belum dikonfigurasi.",
  },
];

function mapClass(row: ClassRow): ClassGroup {
  return {
    id: row.id,
    name: row.name,
    level: row.level,
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

function cleanClassPayload(data: ClassFormData): ClassInsert {
  return {
    name: data.name.trim(),
    level: data.level.trim() || null,
    description: data.description.trim() || null,
  };
}

async function ensureClassNameAvailable(name: string, excludeId?: string) {
  const supabase = requireSupabase();
  let query = supabase.from("classes").select("id").ilike("name", name).limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal memeriksa duplikasi kelas: ${error.message}`);
  }

  if (data.length > 0) {
    throw new Error("Nama kelas / marhalah sudah digunakan.");
  }
}

function isClassFormData(data: ClassFormData | ClassInsert | ClassUpdate): data is ClassFormData {
  return (
    typeof data.name === "string" &&
    typeof data.level === "string" &&
    typeof data.description === "string"
  );
}

export async function getClasses() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return mockClasses;
  }

  const { data, error } = await supabase.from("classes").select("*").order("name");

  if (error) {
    throw new Error(`Gagal mengambil data kelas: ${error.message}`);
  }

  return data.map(mapClass);
}

export async function createClass(data: ClassFormData | ClassInsert) {
  const supabase = requireSupabase();
  const payload = isClassFormData(data) ? cleanClassPayload(data) : data;
  if (payload.name) await ensureClassNameAvailable(payload.name);
  const { data: classGroup, error } = await supabase
    .from("classes")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menambah kelas: ${error.message}`);
  }

  return mapClass(classGroup);
}

export async function updateClass(id: string, data: ClassFormData | ClassUpdate) {
  const supabase = requireSupabase();
  const payload = isClassFormData(data) ? cleanClassPayload(data) : data;
  if (payload.name) await ensureClassNameAvailable(payload.name, id);
  const { data: classGroup, error } = await supabase
    .from("classes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui kelas: ${error.message}`);
  }

  return mapClass(classGroup);
}

export async function deleteClass(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("classes").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus kelas: ${error.message}`);
  }

  return true;
}

export function getClassOptions() {
  return mockClasses.map((classGroup) => ({
    label: classGroup.name,
    value: classGroup.id,
  }));
}
