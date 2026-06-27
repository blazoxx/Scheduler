"use client";

import { useState } from "react";

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

type Props = {
  loading?: boolean;
  slotResult: SlotResult | null;
  onConfirm?: (data: {
    clientName: string;
    email: string;
    suggestion: Suggestion;
  }) => void;
};

export default function AIResultCard({
  loading = false,
  slotResult,
  onConfirm,
}: Props) {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");

  if (loading) {
    return (
      <div className="rounded-xl border p-6 bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-4">
          AI Scheduler
        </h3>

        <div className="space-y-2 text-gray-500">
          <p>Understanding your request...</p>
          <p>Searching available slots...</p>
          <p>Ranking the best options...</p>
        </div>
      </div>
    );
  }

  if (!slotResult) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-gray-500">
        AI suggestions will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {!slotResult.exactMatch && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <h3 className="font-semibold text-yellow-900">
            Closest Available Slots
          </h3>

          <p className="text-sm text-yellow-800 mt-1">
            {slotResult.message}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={clientName}
          onChange={(e) =>
            setClientName(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div className="space-y-4">

        {slotResult.suggestions.map(
          (suggestion, index) => {
            const formattedDate =
              new Date(
                suggestion.date
              ).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              });

            return (
              <div
                key={`${suggestion.start_time}-${index}`}
                className="rounded-xl border bg-white shadow-sm p-5"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <h3 className="text-lg font-semibold">
                      {suggestion.title}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {formattedDate}
                    </p>
                  </div>

                  {index === 0 && (
                    <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium">
                      Best Match
                    </span>
                  )}

                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">
                      Time
                    </p>

                    <p className="font-medium">
                      {suggestion.start_time} -{" "}
                      {suggestion.end_time}
                    </p>
                  </div>

                  <div className="rounded border p-3">
                    <p className="text-xs text-gray-500">
                      Duration
                    </p>

                    <p className="font-medium">
                      {suggestion.duration} mins
                    </p>
                  </div>

                </div>

                <button
                  disabled={
                    !clientName.trim() ||
                    !email.trim()
                  }
                  onClick={() =>
                    onConfirm?.({
                      clientName:
                        clientName.trim(),
                      email: email.trim(),
                      suggestion,
                    })
                  }
                  className="mt-5 w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Book This Slot
                </button>
              </div>
            );
          }
        )}

      </div>
    </div>
  );
}