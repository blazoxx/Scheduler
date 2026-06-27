import { supabase } from "./supabase";

type BookAppointmentParams = {
  userId: string;
  clientName: string;
  email: string;
  title: string;
  date: string;
  startTime: string;
  duration: number;
};

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);

  const total = hours * 60 + mins + minutes;

  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60
  ).padStart(2, "0")}`;
}

export async function bookAppointment({
  userId,
  clientName,
  email,
  title,
  date,
  startTime,
  duration,
}: BookAppointmentParams) {
  const endTime = addMinutes(startTime, duration);

  const { error } = await supabase
    .from("appointments")
    .insert({
      user_id: userId,
      client_name: clientName,
      email,
      title,
      date,
      start_time: startTime,
      end_time: endTime,
      status: "scheduled",
    });

  return {
    error,
    endTime,
  };
}