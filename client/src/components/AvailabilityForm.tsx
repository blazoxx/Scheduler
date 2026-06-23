"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AvailabilityForm() {
  const [day, setDay] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function addSlot() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.from("availability").upsert(
      [
        {
          user_id: user?.id,
          day_of_week: day,
          start_time: startTime,
          end_time: endTime,
        },
      ],
      {
        onConflict: "user_id,day_of_week",
      },
    );

    console.log(data);
    console.log(error);

    if (!error) {
      setDay(0);
      setStartTime("");
      setEndTime("");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <select
        value={day}
        onChange={(e) => setDay(Number(e.target.value))}
        className="border p-2"
      >
        <option value={0}>Sunday</option>
        <option value={1}>Monday</option>
        <option value={2}>Tuesday</option>
        <option value={3}>Wednesday</option>
        <option value={4}>Thursday</option>
        <option value={5}>Friday</option>
        <option value={6}>Saturday</option>
      </select>

      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="border p-2"
      />

      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="border p-2"
      />

      <button onClick={addSlot} className="bg-blue-500 text-white p-2 rounded">
        Add Slot
      </button>
    </div>
  );
}
