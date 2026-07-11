import { supabase } from "@/src/lib/supabase";

export async function updateUserTimezone(userId: string) {
  const browserTimezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .single();

  if (profile?.timezone === browserTimezone) {
    return;
  }

  await supabase
    .from("profiles")
    .update({
      timezone: browserTimezone,
    })
    .eq("id", userId);
}