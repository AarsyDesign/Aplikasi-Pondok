import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type LoginAdminParams = {
  email: string;
  password: string;
};

export async function loginAdmin({ email, password }: LoginAdminParams) {
  const supabase = createSupabaseBrowserClient();

  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function logoutAdmin() {
  const supabase = createSupabaseBrowserClient();

  return supabase.auth.signOut();
}
