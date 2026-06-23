"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
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

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel("appointments-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        (payload) => {
          console.log("Realtime:", payload);
          fetchAppointments();
        },
      )
      .subscribe((status) => {
        console.log("Channel status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchAppointments() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user?.id)
      .order("date")
      .order("start_time");

    if (error) {
      console.log(error);
      return;
    }

    const sorted = [...(data || [])].sort((a, b) => {
      const priority: Record<string, number> = {
        scheduled: 0,
        completed: 1,
        cancelled: 2,
      };

      return priority[a.status] - priority[b.status];
    });

    setAppointments(sorted);
  }

  async function completeAppointment(id: string) {
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "completed",
      })
      .eq("id", id);

    if (error) {
      console.log(error);
    }
  }

  async function cancelAppointment(id: string) {
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "cancelled",
      })
      .eq("id", id);

    if (error) {
      console.log(error);
    }
  }

  async function deleteAppointment(id: string) {
    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id),
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Appointments</h2>

        <p className="mt-4 text-gray-500">No appointments yet.</p>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === "scheduled",
  );

  const historyAppointments = appointments.filter(
    (appointment) => appointment.status !== "scheduled",
  );

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold">Upcoming Appointments</h2>

      {upcomingAppointments.map((appointment) => (
        <div
          key={appointment.id}
          className="border p-4 rounded flex justify-between"
        >
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
            <button
              disabled={appointment.status !== "scheduled"}
              onClick={() => completeAppointment(appointment.id)}
              className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Complete
            </button>

            <button
              disabled={appointment.status !== "scheduled"}
              onClick={() => cancelAppointment(appointment.id)}
              className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={() => deleteAppointment(appointment.id)}
              className="bg-gray-700 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-10">Appointment History</h2>

      {historyAppointments.map((appointment) => (
        <div
          key={appointment.id}
          className="border p-4 rounded flex justify-between opacity-80"
        >
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

          <button
            onClick={() => deleteAppointment(appointment.id)}
            className="bg-gray-700 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}

    </div>
  );
}
