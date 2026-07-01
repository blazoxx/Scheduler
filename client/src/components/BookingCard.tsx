import { supabase } from "@/src/lib/supabase";
import type { Appointment } from "@/src/types/appointment";

type Props = {
  appointment: Appointment;
  onReschedule?: (appointment: Appointment) => void;
};

export default function BookingCard({ appointment, onReschedule }: Props) {
  async function cancelAppointment(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("appointments")
      .update({
        status: "cancelled",
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const canManage =
    appointment.status === "scheduled" && appointment.date >= today;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{appointment.title}</h3>

        <span
          className={`rounded-full px-3 py-1 text-sm ${
            appointment.status === "scheduled"
              ? "bg-green-100 text-green-700"
              : appointment.status === "completed"
                ? "bg-blue-100 text-blue-700"
                : appointment.status === "cancelled"
                  ? "bg-gray-100 text-gray-700"
                  : appointment.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-gray-600">
        <p>📅 {appointment.date}</p>

        <p>
          🕒 {appointment.start_time} - {appointment.end_time}
        </p>
      </div>

      {canManage && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => cancelAppointment(appointment.id)}
            className="rounded bg-red-500 px-4 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => onReschedule?.(appointment)}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Reschedule
          </button>
        </div>
      )}
    </div>
  );
}
