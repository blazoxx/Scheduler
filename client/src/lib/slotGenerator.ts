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

  console.log("DAY OF WEEK:", dayOfWeek);
  console.log("USER:", userId);

  // Working hours
  const { data: availability, error } = await supabase
    .from("availability")
    .select("*")
    .eq("user_id", userId);

  console.log("AVAILABILITY RAW:", availability);
  console.log("AVAILABILITY ERROR:", error);

  console.log("AVAILABILITY:", availability);

  // if (!availability) {
  //   return [];
  // }
  return [];

  // Existing appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("start_time,end_time,status")
    .eq("user_id", userId)
    .eq("date", date)
    .in("status", ["scheduled", "completed"]);

  console.log("APPOINTMENTS:", appointments);

  const availableSlots: string[] = [];

  const workStart = timeToMinutes(availability.start_time);
  const workEnd = timeToMinutes(availability.end_time);

  console.log("WORK START:", workStart);
  console.log("WORK END:", workEnd);

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

    console.log(
      "CHECKING SLOT:",
      minutesToTime(slotStart),
      "-",
      minutesToTime(slotEnd)
    );
  }

  return availableSlots;
}