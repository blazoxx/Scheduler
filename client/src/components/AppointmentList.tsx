"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import AppointmentCard from "./AppointmentCard";
import type { Appointment } from "@/src/types/appointment";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAppointments([]);
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", user.id)
      .order("date")
      .order("start_time");

    if (error) {
      console.error(error);
      return;
    }

    const priority: Record<Appointment["status"], number> = {
      pending: 0,
      scheduled: 1,
      completed: 2,
      cancelled: 3,
      rejected: 4,
    };

    const sorted = [...(data ?? [])].sort((a, b) => {
      const aStatus = a.status as Appointment["status"];
      const bStatus = b.status as Appointment["status"];

      return priority[aStatus] - priority[bStatus];
    });

    setAppointments(sorted);
  };

  async function completeAppointment(id: string) {
    const { error } = await supabase
      .from("appointments")
      .update({
        status: "completed",
      })
      .eq("id", id);

    if (error) {
      console.error(error);
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
      console.error(error);
    }
  }

  async function deleteAppointment(id: string) {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id),
    );
  }

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

  const today = new Date().toISOString().split("T")[0];

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  );

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "scheduled" &&
      appointment.date >= today,
  );

  const historyAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "completed" ||
      appointment.status === "cancelled" ||
      appointment.status === "rejected" ||
      (appointment.status === "scheduled" &&
        appointment.date < today),
  );

  if (appointments.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Appointments</h2>

        <p className="mt-4 text-gray-500">
          No appointments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold">Pending Requests</h2>

      {pendingAppointments.length === 0 ? (
        <p className="mt-4 text-gray-500">
          No pending requests.
        </p>
      ) : (
        pendingAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment as Appointment}
            onComplete={completeAppointment}
            onCancel={cancelAppointment}
            onDelete={deleteAppointment}
          />
        ))
      )}

      <h2 className="mt-10 text-2xl font-bold">
        Upcoming Appointments
      </h2>

      {upcomingAppointments.length === 0 ? (
        <p className="mt-4 text-gray-500">
          No upcoming appointments.
        </p>
      ) : (
        upcomingAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment as Appointment}
            onComplete={completeAppointment}
            onCancel={cancelAppointment}
            onDelete={deleteAppointment}
          />
        ))
      )}

      <h2 className="mt-10 text-2xl font-bold">
        Appointment History
      </h2>

      {historyAppointments.length === 0 ? (
        <p className="mt-4 text-gray-500">
          No appointment history.
        </p>
      ) : (
        historyAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment as Appointment}
            onComplete={completeAppointment}
            onCancel={cancelAppointment}
            onDelete={deleteAppointment}
          />
        ))
      )}
    </div>
  );
}