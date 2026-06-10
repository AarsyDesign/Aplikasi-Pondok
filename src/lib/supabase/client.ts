import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/utils";
import { Database } from "@/types/database";

type BrowserSupabaseClient = ReturnType<
  typeof createClient<Database, "public", "public">
>;

let browserClient: BrowserSupabaseClient | null = null;

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();

  if (config.error !== null) {
    throw new Error(config.error);
  }

  if (!browserClient) {
    browserClient = createClient<Database, "public", "public">(
      config.supabaseUrl,
      config.supabaseAnonKey,
    );
  }

  return browserClient;
}

export function getSupabaseBrowserClientOrThrow() {
  return createSupabaseBrowserClient();
}
