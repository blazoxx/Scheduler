type Appointment = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
};

type Props = {
  appointment: Appointment;
};

export default function BookingCard({
  appointment,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {appointment.title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-sm ${
            appointment.status === "scheduled"
              ? "bg-green-100 text-green-700"
              : appointment.status === "completed"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-gray-600">
        <p>📅 {appointment.date}</p>

        <p>
          🕒 {appointment.start_time} -{" "}
          {appointment.end_time}
        </p>
      </div>
    </div>
  );
}