import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database, Subject as SubjectRow } from "@/types/database";
import { Subject, SubjectFormData } from "@/types/subject";

type SubjectInsert = Database["public"]["Tables"]["subjects"]["Insert"];
type SubjectUpdate = Database["public"]["Tables"]["subjects"]["Update"];

export const mockSubjects: Subject[] = [
  {
    id: "mp-001",
    name: "Fiqih",
    class_id: "kl-001",
    classId: "kl-001",
    className: "Marhalah 1",
    description: "Data contoh saat Supabase belum dikonfigurasi.",
  },
  {
    id: "mp-002",
    name: "Nahwu",
    class_id: "kl-001",
    classId: "kl-001",
    className: "Marhalah 1",
    description: "Data contoh saat Supabase belum dikonfigurasi.",
  },
  {
    id: "mp-003",
    name: "Tahfidz",
    class_id: "kl-002",
    classId: "kl-002",
    className: "Marhalah 2",
    description: "Data contoh saat Supabase belum dikonfigurasi.",
  },
];

function mapSubject(row: SubjectRow, className = "Kelas tidak ditemukan"): Subject {
  return {
    id: row.id,
    name: row.name,
    class_id: row.class_id,
    classId: row.class_id,
    className: row.class_id ? className : "Belum ada kelas",
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

function cleanSubjectPayload(data: SubjectFormData): SubjectInsert {
  return {
    name: data.name.trim(),
    class_id: data.class_id,
    description: data.description.trim() || null,
  };
}

async function ensureSubjectAvailable(name: string, classId: string | null | undefined, excludeId?: string) {
  const supabase = requireSupabase();
  let query = supabase.from("subjects").select("id").ilike("name", name).limit(1);

  query = classId ? query.eq("class_id", classId) : query.is("class_id", null);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Gagal memeriksa duplikasi mata pelajaran: ${error.message}`);
  }

  if (data.length > 0) {
    throw new Error("Mata pelajaran untuk kelas ini sudah ada.");
  }
}

function isSubjectFormData(
  data: SubjectFormData | SubjectInsert | SubjectUpdate,
): data is SubjectFormData {
  return (
    typeof data.name === "string" &&
    typeof data.class_id === "string" &&
    typeof data.description === "string"
  );
}

async function getClassNameMap() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return new Map([
      ["kl-001", "Marhalah 1"],
      ["kl-002", "Marhalah 2"],
    ]);
  }

  const { data, error } = await supabase.from("classes").select("id, name");

  if (error) {
    throw new Error(`Gagal mengambil data kelas untuk mapel: ${error.message}`);
  }

  return new Map(data.map((classGroup) => [classGroup.id, classGroup.name]));
}

function sortSubjects(subjects: Subject[]) {
  return [...subjects].sort((first, second) => {
    const classCompare = first.className.localeCompare(second.className);

    if (classCompare !== 0) {
      return classCompare;
    }

    return first.name.localeCompare(second.name);
  });
}

export async function getSubjects() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return mockSubjects;
  }

  const [classNameMap, subjectsResult] = await Promise.all([
    getClassNameMap(),
    supabase.from("subjects").select("*").order("name"),
  ]);

  const { data, error } = subjectsResult;

  if (error) {
    throw new Error(`Gagal mengambil data mapel: ${error.message}`);
  }

  return sortSubjects(
    data.map((subject) =>
      mapSubject(
        subject,
        subject.class_id
          ? (classNameMap.get(subject.class_id) ?? "Kelas tidak ditemukan")
          : "Belum ada kelas",
      ),
    ),
  );
}

export async function getSubjectsByClass(classId: string) {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return mockSubjects;
  }

  const [classNameMap, subjectsResult] = await Promise.all([
    getClassNameMap(),
    supabase.from("subjects").select("*").eq("class_id", classId).order("name"),
  ]);

  const { data, error } = subjectsResult;

  if (error) {
    throw new Error(`Gagal mengambil mapel per kelas: ${error.message}`);
  }

  return data.map((subject) =>
    mapSubject(
      subject,
      subject.class_id
        ? (classNameMap.get(subject.class_id) ?? "Kelas tidak ditemukan")
        : "Belum ada kelas",
    ),
  );
}

export async function createSubject(data: SubjectFormData | SubjectInsert) {
  const supabase = requireSupabase();
  const payload = isSubjectFormData(data) ? cleanSubjectPayload(data) : data;
  if (payload.name) await ensureSubjectAvailable(payload.name, payload.class_id);
  const { data: subject, error } = await supabase
    .from("subjects")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menambah mapel: ${error.message}`);
  }

  const classNameMap = await getClassNameMap();

  return mapSubject(
    subject,
    subject.class_id
      ? (classNameMap.get(subject.class_id) ?? "Kelas tidak ditemukan")
      : "Belum ada kelas",
  );
}

export async function updateSubject(id: string, data: SubjectFormData | SubjectUpdate) {
  const supabase = requireSupabase();
  const payload = isSubjectFormData(data) ? cleanSubjectPayload(data) : data;
  if (payload.name) await ensureSubjectAvailable(payload.name, payload.class_id, id);
  const { data: subject, error } = await supabase
    .from("subjects")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui mapel: ${error.message}`);
  }

  const classNameMap = await getClassNameMap();

  return mapSubject(
    subject,
    subject.class_id
      ? (classNameMap.get(subject.class_id) ?? "Kelas tidak ditemukan")
      : "Belum ada kelas",
  );
}

export async function deleteSubject(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("subjects").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus mata pelajaran: ${error.message}`);
  }

  return true;
}

export function getSubjectOptions() {
  return mockSubjects.map((subject) => ({
    label: `${subject.name} - ${subject.className}`,
    value: subject.id,
  }));
}
