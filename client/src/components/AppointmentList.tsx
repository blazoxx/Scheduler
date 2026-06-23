"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import StatusBadge from "./StatusBadge";
import AppointmentCard from "./AppointmentCard";

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
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onComplete={completeAppointment}
          onCancel={cancelAppointment}
          onDelete={deleteAppointment}
        />
      ))}

      <h2 className="text-2xl font-bold mt-10">Appointment History</h2>

      {historyAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onComplete={completeAppointment}
          onCancel={cancelAppointment}
          onDelete={deleteAppointment}
        />
      ))}
    </div>
  );
}
