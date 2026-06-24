import { supabase } from "./supabase";

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");

  const mins = (minutes % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${mins}`;
}

export async function getAvailableSlots(
  userId: string,
  date: string,
  duration = 30
): Promise<string[]> {

  const dayOfWeek = new Date(date).getDay();

  // Working hours
  const { data: availability } = await supabase
    .from("availability")
    .select("start_time,end_time")
    .eq("user_id", userId)
    .eq("day_of_week", dayOfWeek)
    .single();

  if (!availability) {
    return [];
  }

  // Existing appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("start_time,end_time,status")
    .eq("user_id", userId)
    .eq("date", date)
    .in("status", ["scheduled", "completed"]);

  const availableSlots: string[] = [];

  const workStart = timeToMinutes(availability.start_time);
  const workEnd = timeToMinutes(availability.end_time);

  for (
    let current = workStart;
    current + duration <= workEnd;
    current += duration
  ) {
    const slotStart = current;
    const slotEnd = current + duration;

    let isOccupied = false;

    for (const appointment of appointments || []) {
      const appointmentStart = timeToMinutes(appointment.start_time);
      const appointmentEnd = timeToMinutes(appointment.end_time);

      if (
        slotStart < appointmentEnd &&
        slotEnd > appointmentStart
      ) {
        isOccupied = true;
        break;
      }
    }

    if (!isOccupied) {
      availableSlots.push(minutesToTime(slotStart));
    }
  }

  return availableSlots;
}