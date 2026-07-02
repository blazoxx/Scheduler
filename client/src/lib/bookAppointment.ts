type BookAppointmentParams = {
  userId: string;
  clientName: string;
  email: string;
  title: string;
  date: string;
  startTime: string;
  duration: number;
  oldAppointmentId?: string;
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
  oldAppointmentId,
}: BookAppointmentParams) {
  const endTime = addMinutes(startTime, duration);

  const response = await fetch("/api/book-appointment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      clientName,
      email,
      title,
      date,
      start_time: startTime,
      end_time: endTime,
      oldAppointmentId,
    }),
  });

  const data = await response.json().catch(() => null);

  return {
    error: response.ok ? null : data ?? { error: "Booking failed" },
    endTime,
  };
}