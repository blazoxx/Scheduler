"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AvailabilityForm() {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function addSlot() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.from("availability").insert([
      {
        user_id: user?.id,
        day,
        start_time: startTime,
        end_time: endTime,
      },
    ]);

    console.log(data);
    console.log(error);

    if (!error) {
      setDay("");
      setStartTime("");
      setEndTime("");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="date"
        min={new Date().toISOString().split("T")[0]}
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className="border p-2"
      />

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
