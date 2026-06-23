"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import router from "next/router";

type Props = {
  userId: string;
  selectedDate: string;
  selectedSlot: string;
};

function addThirtyMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const totalMinutes = hours * 60 + minutes + 30;

  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");

  const m = (totalMinutes % 60).toString().padStart(2, "0");

  return `${h}:${m}`;
}

export default function PublicBookingForm({
  userId,
  selectedDate,
  selectedSlot,
}: Props) {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");

  async function handleSubmit() {
    const endTime = addThirtyMinutes(selectedSlot);

    const { error } = await supabase.from("appointments").insert({
      user_id: userId,
      client_name: clientName,
      email,
      title,
      date: selectedDate,
      start_time: selectedSlot,
      end_time: endTime,
      status: "scheduled",
    });

    if (error) {
      console.error(error);
      return;
    }

    router.push(
      `/success?date=${selectedDate}&start=${selectedSlot}&end=${endTime}&email=${email}`,
    );
  }

  return (
    <div className="space-y-4 border rounded p-6 mt-6">
      {/* inputs */}

      <button onClick={handleSubmit} className="bg-blue-600 px-4 py-2 rounded">
        Book Appointment
      </button>
    </div>
  );
}
