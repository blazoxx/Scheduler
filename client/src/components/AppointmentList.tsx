"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user?.id);

    if (error) {
      console.log(error);
      return;
    }

    setAppointments(data || []);
  }

  async function deleteAppointment(id: string) {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setAppointments(
      appointments.filter(
        (appointment) => appointment.id !== id
      )
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
            onClick={() =>
              deleteAppointment(appointment.id)
            }
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}