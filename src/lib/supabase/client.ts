import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/utils";
import { Database } from "@/types/database";

type BrowserSupabaseClient = ReturnType<
  typeof createBrowserClient<Database, "public">
>;

let browserClient: BrowserSupabaseClient | null = null;

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();

  if (config.error !== null) {
    throw new Error(config.error);
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database, "public">(
      config.supabaseUrl,
      config.supabaseAnonKey,
    );
  }

  return browserClient;
}

export function getSupabaseBrowserClientOrThrow() {
  return createSupabaseBrowserClient();
}
