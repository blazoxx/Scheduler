"use client";

type Suggestion = {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
};

type Props = {
  suggestion: Suggestion | null;
  loading?: boolean;
  onConfirm?: () => void;
};

export default function AIResultCard({
  suggestion,
  loading = false,
  onConfirm,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border p-6 bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-4">
          AI Scheduler
        </h3>

        <div className="space-y-2 text-gray-500">
          <p>🤖 Analyzing request...</p>
          <p>📅 Finding available slots...</p>
          <p>⚡ Preparing recommendation...</p>
        </div>
      </div>
    );
  }

  if (!suggestion) {
    return (
      <div className="rounded-xl border border-dashed p-6 bg-white text-center text-gray-500">
        AI suggestion will appear here.
      </div>
    );
  }

  const formattedDate = new Date(
    suggestion.date
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border bg-white shadow-sm p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold">
          AI Suggestion
        </h2>

        <p className="text-gray-500">
          Review before confirming.
        </p>
      </div>

      <div className="space-y-4">

        <div>
          <p className="text-sm text-gray-500">
            Meeting
          </p>

          <p className="text-xl font-semibold">
            {suggestion.title}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Date
            </p>

            <p className="font-medium">
              {formattedDate}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Time
            </p>

            <p className="font-medium">
              {suggestion.start_time} - {suggestion.end_time}
            </p>
          </div>

        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">
            Duration
          </p>

          <p className="font-medium">
            {suggestion.duration} minutes
          </p>
        </div>

      </div>

      <button
        onClick={onConfirm}
        className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>
    </div>
  );
}