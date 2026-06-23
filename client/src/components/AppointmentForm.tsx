"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { getAvailableSlots } from "@/src/lib/slotGenerator";

export default function AppointmentForm() {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  async function addAppointment() {
    if (!clientName || !email || !title || !date || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      alert("Past dates are not allowed");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("appointments").insert([
      {
        user_id: user?.id,
        client_name: clientName,
        email,
        title,
        date,
        start_time: startTime,
        end_time: endTime,
      },
    ]);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    setClientName("");
    setEmail("");
    setTitle("");
    setStartTime("");
    setEndTime("");

    if (user && date) {
      const slots = await getAvailableSlots(user.id, date, 30);
      setAvailableSlots(slots);
    }
  }

  return (
    <div className="flex flex-col gap-3 mt-8 border p-4 rounded">
      <h2 className="text-2xl font-bold">Create Appointment</h2>

      <input
        type="text"
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="border p-2"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2"
      />

      <input
        type="date"
        min={new Date().toISOString().split("T")[0]}
        value={date}
        onChange={async (e) => {
          const selectedDate = e.target.value;

          setDate(selectedDate);
          setStartTime("");
          setEndTime("");

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user && selectedDate) {
            const slots = await getAvailableSlots(
              user.id,
              selectedDate,
              30
            );

            setAvailableSlots(slots);
          }
        }}
        className="border p-2"
      />

      <select
        value={startTime}
        onChange={(e) => {
          const selected = e.target.value;

          setStartTime(selected);

          const [h, m] = selected.split(":").map(Number);

          const totalMinutes = h * 60 + m + 30;

          const endH = Math.floor(totalMinutes / 60)
            .toString()
            .padStart(2, "0");

          const endM = (totalMinutes % 60)
            .toString()
            .padStart(2, "0");

          setEndTime(`${endH}:${endM}`);
        }}
        className="border p-2"
      >
        <option value="">Select Time</option>

        {availableSlots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      {date && availableSlots.length === 0 && (
        <p className="text-red-500">
          No slots available for this date.
        </p>
      )}

      {endTime && (
        <p className="text-gray-600">
          Ends at: {endTime}
        </p>
      )}

      <button
        onClick={addAppointment}
        disabled={!startTime}
        className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
      >
        Create Appointment
      </button>
    </div>
  );
}