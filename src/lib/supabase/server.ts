import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/utils";
import { Database } from "@/types/database";

export function createSupabaseServerClient() {
  const config = getSupabaseConfig();

  if (config.error !== null) {
    return null;
  }

  return createClient<Database, "public", "public">(
    config.supabaseUrl,
    config.supabaseAnonKey,
  );
}
