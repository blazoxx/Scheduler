"use client";

import StatusBadge from "./StatusBadge";

type Appointment = {
  id: string;
  client_name: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "completed" | "cancelled";
};

type Props = {
  appointment: Appointment;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function AppointmentCard({
  appointment,
  onComplete,
  onCancel,
  onDelete,
}: Props) {
  return (
    <div className="border p-4 rounded flex justify-between">
      <div>
        <p>
          <strong>{appointment.client_name}</strong>
        </p>

        <p className="text-gray-400">{appointment.title}</p>

        <div className="mt-2">
          <StatusBadge status={appointment.status} />
        </div>

        <p>{appointment.date}</p>

        <p>
          {appointment.start_time} - {appointment.end_time}
        </p>
      </div>

      <div className="flex gap-2">
        {appointment.status === "scheduled" && (
          <>
            <button
              onClick={() => onComplete(appointment.id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Complete
            </button>

            <button
              onClick={() => onCancel(appointment.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </>
        )}

        <button
          onClick={() => onDelete(appointment.id)}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}