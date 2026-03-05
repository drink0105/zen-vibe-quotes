import { supabase } from "./supabase";

export function getUserId() {
  let id = localStorage.getItem("zenvibe_user_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("zenvibe_user_id", id);
  }

  return id;
}

export async function ensureUser() {
  const id = getUserId();

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
