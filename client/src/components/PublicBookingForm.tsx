"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  username: string;
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
  username,
  selectedDate,
  selectedSlot,
}: Props) {
  const router = useRouter();

  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

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

    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        alert("Slot already booked.");
        return;
      }

      console.error(error);
      alert("Something went wrong.");
      return;
    }

    router.push(
      `/success?username=${username}&date=${selectedDate}&start=${selectedSlot}&end=${endTime}&email=${email}`,
    );
  }

  return (
    <div className="space-y-4 border rounded p-6 mt-6">
      <h2 className="text-2xl font-semibold">Book Appointment</h2>

      <input
        placeholder="Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="w-full border rounded p-2"
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2"
      />

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2"
      />

      <div>Date: {selectedDate}</div>

      <div>Time: {selectedSlot}</div>

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
}
