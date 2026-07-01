"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AIResultCard from "./AIResultCard";
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

  // User-selected host (null = first host)
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);

  // Actual host currently being used
  const activeHostId = selectedHostId ?? hosts?.[0]?.id ?? "";

  const activeHostData = hosts?.find(
    (host) => host.id === activeHostId
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState("");

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
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-xl font-semibold">
        {appointmentToReschedule
          ? "Reschedule Appointment"
          : "AI Scheduler"}
      </h2>

      {appointmentToReschedule && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3">
          <p className="font-medium">
            Rescheduling:
          </p>

          <p>{appointmentToReschedule.title}</p>

          <p>
            {appointmentToReschedule.date}
          </p>

          <p>
            {appointmentToReschedule.start_time} -{" "}
            {appointmentToReschedule.end_time}
          </p>

          <button
            onClick={clearReschedule}
            className="mt-3 rounded bg-gray-600 px-3 py-1 text-white"
          >
            Cancel Reschedule
          </button>
        </div>
      )}

      {hosts && (
        <div className="space-y-2">
          <label className="font-medium">
            Select Host
          </label>

          <select
            value={activeHostId}
            onChange={(e) =>
              setSelectedHostId(e.target.value)
            }
            className="w-full rounded border p-3"
          >
            {hosts.map((host) => (
              <option
                key={host.id}
                value={host.id}
              >
                {host.full_name} (@{host.username})
              </option>
            ))}
          </select>
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Need a 30 minute meeting next Friday afternoon regarding project discussion"
        className="min-h-32 w-full rounded border p-3"
      />

      <button
        onClick={handleSchedule}
        disabled={loading || !message}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading
          ? "Analyzing..."
          : appointmentToReschedule
          ? "Find New Slot"
          : "Schedule with AI"}
      </button>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      <AIResultCard
        loading={loading}
        slotResult={result?.slotResult ?? null}
        defaultName={fullName}
        defaultEmail={email}
        onConfirm={async ({
          clientName,
          email,
          suggestion,
        }) => {
          if (!suggestion) return;

          try {
            const response = await fetch(
              "/api/book-appointment",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  userId: hosts
                    ? activeHostId
                    : userId,

                  clientName,
                  email,

                  title: suggestion.title,
                  date: suggestion.date,
                  start_time:
                    suggestion.start_time,
                  end_time:
                    suggestion.end_time,
                  duration:
                    suggestion.duration,

                  oldAppointmentId:
                    appointmentToReschedule?.id,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.error || "Booking failed"
              );
            }

            clearReschedule();

            setResult(null);
            setMessage("");

            router.push(
              `/success?username=${
                hosts
                  ? activeHostData?.username
                  : username
              }&date=${suggestion.date}&start=${
                suggestion.start_time
              }&end=${
                suggestion.end_time
              }&email=${encodeURIComponent(
                email
              )}`
            );
          } catch (err) {
            alert(
              err instanceof Error
                ? err.message
                : "Booking failed"
            );
          }
        }}
      />
    </div>
  );
}