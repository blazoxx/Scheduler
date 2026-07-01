"use client";

import { useEffect, useState } from "react";
import PublicBookingForm from "./PublicBookingForm";
import AIScheduler from "./AIScheduler";

type Props = {
  userId: string;
  username: string;
  fullName: string;
  email: string;
};

export default function BookingCalendar({
  userId,
  username,
  fullName,
  email,
}: Props) {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    if (!selectedDate) return;

    async function loadSlots() {
      setLoading(true);

      const response = await fetch("/api/available-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          date: selectedDate,
          duration: 30,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load slots");
      }

      setSlots(data.slots);
    }

    loadSlots();
  }, [selectedDate, userId]);

  return (
    <div className="space-y-4">
      <AIScheduler
        userId={userId}
        username={username}
        fullName={fullName}
        email={email}
      />
      
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border rounded px-3 py-2"
      />

      {loading && <p>Loading slots...</p>}

      {!loading && slots.length === 0 && selectedDate && (
        <p>No slots available</p>
      )}

      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`border px-4 py-2 rounded
            ${selectedSlot === slot ? "bg-blue-600" : ""}`}
          >
            {slot}
          </button>
        ))}
      </div>

      {selectedSlot && (
        <PublicBookingForm
          userId={userId}
          username={username}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
        />
      )}
    </div>
  );
}
