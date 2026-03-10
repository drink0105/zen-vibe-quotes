import { supabase } from "@/integrations/supabase/client";

/**
 * Get the current authenticated user's ID.
 * Uses Supabase anonymous auth — no localStorage spoofing possible.
 */
export async function getUserId(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    return session.user.id;
  }

  // Sign in anonymously if no session exists
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    throw new Error("Failed to create anonymous session");
  }
  return data.user.id;
}

/**
 * Ensure user row exists in the users table.
 * Called once on app startup after anonymous auth.
 */
export async function ensureUser(): Promise<string> {
  const id = await getUserId();

  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .single();

  if (!data) {
    await supabase.from("users").insert({ id });
  }

  return id;
}
