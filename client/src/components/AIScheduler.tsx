"use client";

import { useEffect, useState } from "react";
import AIResultCard from "./AIResultCard";
import { useRouter } from "next/navigation";

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
}: Props) {
  const [message, setMessage] = useState("");
  const [selectedHost, setSelectedHost] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (hosts && hosts.length > 0 && !selectedHost) {
      setSelectedHost(hosts[0].id);
    }
  }, [hosts, selectedHost]);
  const selectedHostData = hosts?.find((host) => host.id === selectedHost);

  async function handleSchedule() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      console.log("SELECTED HOST:", selectedHost);
      console.log("HOSTS:", hosts);

      const response = await fetch("/api/ai-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: hosts ? selectedHost : userId,
          message,
        }),
      });

      const data = await response.json();
      console.log("API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule");
      }

      setResult(data);
      console.log("SETTING RESULT");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  console.log("RESULT STATE:", result);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h2 className="text-xl font-semibold">AI Scheduler</h2>

      {hosts && (
        <div className="space-y-2">
          <label className="font-medium">Select Host</label>

          <select
            value={selectedHost}
            onChange={(e) => setSelectedHost(e.target.value)}
            className="w-full rounded border p-3"
          >
            {hosts.map((host) => (
              <option key={host.id} value={host.id}>
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
        className="w-full border rounded p-3 min-h-30"
      />

      <button
        onClick={handleSchedule}
        disabled={loading || !message}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Schedule with AI"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <AIResultCard
        loading={loading}
        slotResult={result?.slotResult ?? null}
        defaultName={fullName}
        defaultEmail={email}
        onConfirm={async ({
          clientName,
          email,
          suggestion,
        }: {
          clientName: string;
          email: string;
          suggestion?: Suggestion | null;
        }) => {
          if (!suggestion) return;

          try {
            console.log("BOOKING HOST ID:", hosts ? selectedHost : userId);

            console.log({
              selectedHost,
              hosts,
              userId,
            });
            const response = await fetch("/api/book-appointment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: hosts ? selectedHost : userId,

                clientName,
                email,

                title: suggestion.title,
                date: suggestion.date,
                start_time: suggestion.start_time,
                end_time: suggestion.end_time,
                duration: suggestion.duration,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || "Booking failed");
            }

            router.push(
              `/success?username=${
                hosts ? selectedHostData?.username : username
              }&date=${suggestion.date}&start=${suggestion.start_time}&end=${suggestion.end_time}&email=${encodeURIComponent(email)}`,
            );

            setResult(null);
            setMessage("");
          } catch (err) {
            alert(err instanceof Error ? err.message : "Booking failed");
          }
        }}
      />
    </div>
  );
}
