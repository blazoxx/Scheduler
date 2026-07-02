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

export default function PendingRequests() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("date");

    if (error) {
      console.error(error);
      return;
    }

    setAppointments(data ?? []);
  }

  async function approveAppointment(id: string) {
    const res = await fetch("/api/update-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId: id,
        status: "scheduled",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    fetchPending();
  }

  async function rejectAppointment(id: string) {
    const res = await fetch("/api/update-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId: id,
        status: "rejected",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    fetchPending();
  }

  return (
    <div className="mt-8 rounded-xl border p-6">
      <h2 className="mb-6 text-2xl font-bold">Pending Requests</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment.id} className="mb-4 rounded-lg border p-4">
            <h3 className="text-lg font-semibold">{appointment.title}</h3>

            <p>Guest: {appointment.client_name}</p>

            <p>{appointment.date}</p>

            <p>
              {appointment.start_time} - {appointment.end_time}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => approveAppointment(appointment.id)}
                className="rounded bg-green-600 px-4 py-2 text-white"
              >
                Approve
              </button>

              <button
                onClick={() => rejectAppointment(appointment.id)}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
