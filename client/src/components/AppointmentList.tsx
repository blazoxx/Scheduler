"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type Appointment = {
  id: string;
  client_name: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
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

    setAppointments(data || []);
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

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold">Appointments</h2>

      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="border p-4 rounded flex justify-between"
        >
          <div>
            <p>
              <strong>{appointment.client_name}</strong>
            </p>

            <p>{appointment.title}</p>

            <p>{appointment.date}</p>

            <p>
              {appointment.start_time} - {appointment.end_time}
            </p>
          </div>

          <button
            onClick={() => deleteAppointment(appointment.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
