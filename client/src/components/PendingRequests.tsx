"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Badge from "@/src/components/ui/badge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";

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

  async function approveAppointment(id: string, meetingLink: string) {
    const res = await fetch("/api/update-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId: id,
        status: "scheduled",
        meetingLink,
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
    <div className="mt-8 space-y-4">
      {appointments.length === 0 ? (
        <Card>
          <CardBody className="p-5 text-sm text-slate-600">No pending requests.</CardBody>
        </Card>
      ) : (
        appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardBody className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      {appointment.title}
                    </h3>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>Guest: {appointment.client_name}</p>
                    <p>{appointment.date}</p>
                    <p>
                      {appointment.start_time} - {appointment.end_time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={async () => {
                    const meetingLink = window.prompt(
                      "Enter the meeting link (Google Meet, Zoom, etc.)",
                    );

                    if (!meetingLink) return;

                    try {
                      new URL(meetingLink);
                    } catch {
                      alert("Please enter a valid URL.");
                      return;
                    }

                    await approveAppointment(appointment.id, meetingLink);
                  }}
                  size="sm"
                >
                  Approve
                </Button>

                <Button variant="secondary" size="sm" onClick={() => rejectAppointment(appointment.id)}>
                  Reject
                </Button>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
}
