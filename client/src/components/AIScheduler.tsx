"use client";

import { useState } from "react";
import AIResultCard from "./AIResultCard";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  username: string;
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

export default function AIScheduler({ userId, username }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

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
          userId,
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
            console.log({
              userId,
              clientName,
              email,
              title: suggestion.title,
              date: suggestion.date,
              start_time: suggestion.start_time,
              end_time: suggestion.end_time,
              duration: suggestion.duration,
            });
            const response = await fetch("/api/book-appointment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
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
              `/success?username=${username}&date=${suggestion.date}&start=${suggestion.start_time}&end=${suggestion.end_time}&email=${encodeURIComponent(email)}`,
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
