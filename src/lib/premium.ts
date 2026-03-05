import { supabase } from "./supabase";
import { getUserId } from "./user";

export async function isPremium() {
  const id = getUserId();

  const { data } = await supabase
    .from("users")
    .select("premium")
    .eq("id", id)
    .single();

  return data?.premium === true;
}
