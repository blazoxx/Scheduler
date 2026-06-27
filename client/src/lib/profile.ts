import { supabase } from "./supabase";

export async function getUserByUsername(username: string) {
  console.log("LOOKING FOR:", username);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  console.log("PROFILE DATA:", data);
  console.log("PROFILE ERROR:", error);

  if (error) {
    throw error;
  }

  return data;
}