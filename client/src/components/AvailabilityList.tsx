"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type AvailabilitySlot = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AvailabilityList() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("user_id", user?.id)
      .order("day_of_week");

    if (error) {
      console.log(error);
      return;
    }

    setSlots(data || []);
  }

  async function deleteSlot(id: string) {
    const { error } = await supabase.from("availability").delete().eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  }

  return (
    <div className="space-y-4 mt-6">
      {slots.map((slot) => (
        <div key={slot.id} className="border p-4 rounded flex justify-between">
          <div>
            <p className="font-semibold">{DAYS[slot.day_of_week]}</p>

            <p>
              {slot.start_time} - {slot.end_time}
            </p>
          </div>

          <button
            onClick={() => deleteSlot(slot.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
