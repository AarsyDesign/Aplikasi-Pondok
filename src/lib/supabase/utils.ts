const missingSupabaseEnvMessage =
  "Supabase belum dikonfigurasi. Periksa environment variables NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY.";

type SupabaseConfig =
  | {
      error: null;
      supabaseAnonKey: string;
      supabaseUrl: string;
    }
  | {
      error: string;
      supabaseAnonKey: null;
      supabaseUrl: null;
    };

export function getSupabaseConfig(): SupabaseConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      error: missingSupabaseEnvMessage,
      supabaseAnonKey: null,
      supabaseUrl: null,
    };
  }

  return {
    error: null,
    supabaseAnonKey,
    supabaseUrl,
  };
}

export function getSupabaseConfigError() {
  return getSupabaseConfig().error;
}

export function isSupabaseConfigured() {
  return getSupabaseConfig().error === null;
}
