import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Database, Student as StudentRow } from "@/types/database";
import { Student, StudentFormData } from "@/types/student";

type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];

export const mockStudents: Student[] = [
  {
    id: "st-001",
    nis: "2026001",
    full_name: "Ahmad Fauzan",
    name: "Ahmad Fauzan",
    gender: "laki-laki",
    birth_place: "Bandung",
    birth_date: "2012-03-12",
    guardian_name: "Bapak Abdullah",
    guardian_phone: "081234567001",
    address: "Jl. Pesantren No. 1",
    class_id: "kl-001",
    classId: "kl-001",
    className: "Marhalah 1",
    status: "aktif",
  },
  {
    id: "st-002",
    nis: "2026002",
    full_name: "Muhammad Irfan",
    name: "Muhammad Irfan",
    gender: "laki-laki",
    birth_place: "Garut",
    birth_date: "2012-08-20",
    guardian_name: "Bapak Hasan",
    guardian_phone: "081234567002",
    address: "Kp. Sukamaju",
    class_id: "kl-001",
    classId: "kl-001",
    className: "Marhalah 1",
    status: "aktif",
  },
  {
    id: "st-003",
    nis: "2026003",
    full_name: "Siti Khadijah",
    name: "Siti Khadijah",
    gender: "perempuan",
    birth_place: "Tasikmalaya",
    birth_date: "2011-11-05",
    guardian_name: "Ibu Maryam",
    guardian_phone: "081234567003",
    address: "Jl. Masjid Raya",
    class_id: "kl-002",
    classId: "kl-002",
    className: "Marhalah 2",
    status: "aktif",
  },
];

function mapStudent(row: StudentRow, className = "Belum ada kelas"): Student {
  return {
    id: row.id,
    nis: row.nis,
    full_name: row.full_name,
    name: row.full_name,
    gender: row.gender,
    birth_place: row.birth_place,
    birth_date: row.birth_date,
    guardian_name: row.guardian_name,
    guardian_phone: row.guardian_phone,
    address: row.address,
    class_id: row.class_id,
    classId: row.class_id,
    className,
    status: row.status,
  };
}

function requireSupabase() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return supabase;
}

function cleanStudentPayload(data: StudentFormData): StudentInsert {
  return {
    nis: data.nis.trim() || null,
    full_name: data.full_name.trim(),
    gender: data.gender || null,
    birth_place: data.birth_place.trim() || null,
    birth_date: data.birth_date || null,
    guardian_name: data.guardian_name.trim() || null,
    guardian_phone: data.guardian_phone.trim() || null,
    address: data.address.trim() || null,
    class_id: data.class_id || null,
    status: data.status,
  };
}

function isStudentFormData(data: StudentFormData | StudentInsert | StudentUpdate): data is StudentFormData {
  return (
    typeof data.full_name === "string" &&
    typeof data.nis === "string" &&
    typeof data.birth_place === "string" &&
    typeof data.birth_date === "string" &&
    typeof data.guardian_name === "string" &&
    typeof data.guardian_phone === "string" &&
    typeof data.address === "string" &&
    typeof data.class_id === "string"
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
    throw new Error(`Gagal mengambil nama kelas: ${error.message}`);
  }

  return new Map(data.map((classGroup) => [classGroup.id, classGroup.name]));
}

export async function getStudents() {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return mockStudents;
  }

  const [classNameMap, studentsResult] = await Promise.all([
    getClassNameMap(),
    supabase.from("students").select("*").order("full_name"),
  ]);

  const { data, error } = studentsResult;

  if (error) {
    throw new Error(`Gagal mengambil data santri: ${error.message}`);
  }

  return data.map((student) =>
    mapStudent(
      student,
      student.class_id ? (classNameMap.get(student.class_id) ?? "Kelas tidak ditemukan") : "Belum ada kelas",
    ),
  );
}

export async function getStudentById(id: string) {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return mockStudents.find((student) => student.id === id);
  }

  const { data, error } = await supabase.from("students").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil detail santri: ${error.message}`);
  }

  if (!data) {
    return undefined;
  }

  const classNameMap = await getClassNameMap();

  return mapStudent(
    data,
    data.class_id ? (classNameMap.get(data.class_id) ?? "Kelas tidak ditemukan") : "Belum ada kelas",
  );
}

export async function createStudent(data: StudentFormData | StudentInsert) {
  const supabase = requireSupabase();
  const payload = isStudentFormData(data) ? cleanStudentPayload(data) : data;
  const { data: student, error } = await supabase
    .from("students")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menambah santri: ${error.message}`);
  }

  return student;
}

export async function updateStudent(id: string, data: StudentFormData | StudentUpdate) {
  const supabase = requireSupabase();
  const payload = isStudentFormData(data) ? cleanStudentPayload(data) : data;
  const { data: student, error } = await supabase
    .from("students")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui santri: ${error.message}`);
  }

  return student;
}

export async function deleteStudent(id: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus santri: ${error.message}`);
  }

  return true;
}

export function getStudentOptions() {
  return mockStudents.map((student) => ({
    label: `${student.full_name} - ${student.className}`,
    value: student.id,
  }));
}
