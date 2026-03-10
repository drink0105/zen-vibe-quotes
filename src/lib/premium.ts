import { supabase } from "@/integrations/supabase/client";
import { getUserId } from "./user";

export async function isPremium(): Promise<boolean> {
  const id = await getUserId();

  const { data } = await supabase
    .from("users")
    .select("premium")
    .eq("id", id)
    .single();

  return data?.premium === true;
}
