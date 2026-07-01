import { redirect } from "next/navigation";
import { supabase } from "./supabase";

export async function requireHost() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, is_verified")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !profile ||
    profile.role !== "host" ||
    !profile.is_verified
  ) {
    redirect("/my-bookings");
  }

  return {
    user,
    profile,
  };
}