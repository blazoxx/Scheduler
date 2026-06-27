"use client";

import { useState } from "react";
import AIResultCard from "./AIResultCard";

type Props = {
  userId: string;
};

type ScheduleResult = {
  suggestion: {
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    duration: number;
  } | null;
};

export default function AIScheduler({ userId }: Props) {
  const [message, setMessage] = useState("");
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
        className="w-full border rounded p-3 min-h-[120px]"
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
        suggestion={result?.suggestion ?? null}
        onConfirm={(clientName, email) => {
          console.log({
            clientName,
            email,
            suggestion: result?.suggestion,
          });
        }}
      />
    </div>
  );
}
