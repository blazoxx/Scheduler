import { supabase } from "./supabase";

export async function getUserByUsername(username: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) throw error;

  return data;
}