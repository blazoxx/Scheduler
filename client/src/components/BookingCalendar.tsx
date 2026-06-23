"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { getAvailableSlots } from "@/src/lib/slotGenerator";
import PublicBookingForm from "./PublicBookingForm";

type Props = {
  userId: string;
};

export default function BookingCalendar({ userId }: Props) {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    if (!selectedDate) return;

    async function loadSlots() {
      setLoading(true);

      try {
        const availableSlots = await getAvailableSlots(userId, selectedDate);

        setSlots(availableSlots);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSlots();
  }, [selectedDate, userId]);

  return (
    <div className="space-y-4">
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
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
        />
      )}
    </div>
  );
}
