"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AIResultCard from "./AIResultCard";
import Badge from "@/src/components/ui/badge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";
import Select from "@/src/components/ui/select";
import Textarea from "@/src/components/ui/textarea";
import type { Appointment } from "@/src/types/appointment";

type Host = {
  id: string;
  username: string;
  full_name: string;
};

type Props = {
  fullName: string;
  email: string;
  userId?: string;
  username?: string;
  hosts?: Host[];
  appointmentToReschedule: Appointment | null;
  clearReschedule: () => void;
};

type Suggestion = {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  score: number;
};

type SlotResult = {
  exactMatch: boolean;
  message?: string;
  suggestions: Suggestion[];
};

type ScheduleResult = {
  ai: {
    title: string;
    duration: number;
    date: string;
  };
  slotResult: SlotResult;
};

export default function AIScheduler({
  userId,
  username,
  fullName,
  email,
  hosts,
  appointmentToReschedule,
  clearReschedule,
}: Props) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState("");

  const activeHostId = selectedHostId ?? hosts?.[0]?.id ?? "";
  const activeHostData = hosts?.find((host) => host.id === activeHostId);

  async function handleSchedule() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch("/api/ai-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: hosts ? activeHostId : userId,
          message,
          appointmentToReschedule,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Badge variant={appointmentToReschedule ? "warning" : "info"}>
              {appointmentToReschedule ? "Reschedule" : "AI scheduling"}
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {appointmentToReschedule ? "Reschedule Appointment" : "AI Scheduler"}
            </h2>
          </div>
        </div>

        {appointmentToReschedule ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
              Rescheduling
            </p>
            <p className="mt-2 text-base font-medium text-slate-950">
              {appointmentToReschedule.title}
            </p>
            <p className="mt-1 text-sm text-slate-600">{appointmentToReschedule.date}</p>
            <p className="text-sm text-slate-600">
              {appointmentToReschedule.start_time} - {appointmentToReschedule.end_time}
            </p>

            <Button variant="secondary" size="sm" className="mt-3" onClick={clearReschedule}>
              Cancel reschedule
            </Button>
          </div>
        ) : null}

        {hosts ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Select host</label>
            <Select value={activeHostId} onChange={(e) => setSelectedHostId(e.target.value)}>
              {hosts.map((host) => (
                <option key={host.id} value={host.id}>
                  {host.full_name} (@{host.username})
                </option>
              ))}
            </Select>
          </div>
        ) : null}

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Need a 30 minute meeting next Friday afternoon regarding project discussion"
          className="min-h-32"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button onClick={handleSchedule} disabled={loading || !message}>
            {loading ? "Analyzing..." : appointmentToReschedule ? "Find New Slot" : "Schedule with AI"}
          </Button>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>

        <AIResultCard
          loading={loading}
          slotResult={result?.slotResult ?? null}
          defaultName={fullName}
          defaultEmail={email}
          onConfirm={async ({ clientName, email, suggestion }) => {
            if (!suggestion) return;

            try {
              const response = await fetch("/api/book-appointment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: hosts ? activeHostId : userId,
                  clientName,
                  email,
                  title: suggestion.title,
                  date: suggestion.date,
                  start_time: suggestion.start_time,
                  end_time: suggestion.end_time,
                  duration: suggestion.duration,
                  oldAppointmentId: appointmentToReschedule?.id,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || "Booking failed");
              }

              clearReschedule();
              setResult(null);
              setMessage("");

              router.push(
                `/success?username=${hosts ? activeHostData?.username : username}&date=${suggestion.date}&start=${suggestion.start_time}&end=${suggestion.end_time}&email=${encodeURIComponent(email)}`,
              );
            } catch (err) {
              setError(err instanceof Error ? err.message : "Booking failed");
            }
          }}
        />
      </CardBody>
    </Card>
  );
}
