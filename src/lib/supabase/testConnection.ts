import { getSupabaseBrowserClientOrThrow } from "@/lib/supabase/client";

type ConnectionResult = {
  ok: boolean;
  message: string;
};

function isMissingClassesTable(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("classes") &&
    (normalizedMessage.includes("does not exist") ||
      normalizedMessage.includes("schema cache") ||
      normalizedMessage.includes("relation"))
  );
}

export async function testSupabaseConnection(): Promise<ConnectionResult> {
  try {
    const supabase = getSupabaseBrowserClientOrThrow();
    const { error } = await supabase.from("classes").select("id, name").limit(1);

    if (error) {
      if (isMissingClassesTable(error.message)) {
        return {
          ok: false,
          message:
            "Koneksi Supabase berhasil, tetapi tabel classes belum tersedia. Jalankan schema.sql terlebih dahulu.",
        };
      }

      return {
        ok: false,
        message: `Koneksi Supabase gagal: ${error.message}`,
      };
    }

    return {
      ok: true,
      message: "Koneksi Supabase berhasil dan tabel classes dapat dibaca.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Koneksi Supabase gagal. Periksa konfigurasi environment.",
    };
  }
}
