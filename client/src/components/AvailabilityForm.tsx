"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";

export default function AvailabilityForm() {
  const [day, setDay] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

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

    if (error) {
      console.error(error);
      setMessage(error.message);
    } else {
      console.log("Availability saved");
      setMessage("Availability saved.");
    }

    if (!error) {
      setDay(0);
      setStartTime("");
      setEndTime("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Select value={day} onChange={(e) => setDay(Number(e.target.value))}>
        <option value={0}>Sunday</option>
        <option value={1}>Monday</option>
        <option value={2}>Tuesday</option>
        <option value={3}>Wednesday</option>
        <option value={4}>Thursday</option>
        <option value={5}>Friday</option>
        <option value={6}>Saturday</option>
      </Select>

      <Input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <Input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}

      <Button onClick={addSlot}>
        Add Slot
      </Button>
    </div>
  );
}
