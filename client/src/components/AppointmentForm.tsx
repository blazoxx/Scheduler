"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function AppointmentForm() {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function addAppointment() {
    if (!clientName || !email || !title || !date || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }

    if (new Date(date) < new Date(new Date().toISOString().split("T")[0])) {
      alert("Past dates are not allowed");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    const duration = (end.getTime() - start.getTime()) / (1000 * 60);

    if (duration <= 0) {
      alert("Invalid time range");
      return;
    }

    if (duration > 180) {
      alert("Appointment cannot exceed 3 hours");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.from("appointments").insert([
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

    console.log(data);
    console.log(error);

    if (!error) {
      setClientName("");
      setEmail("");
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
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
        onChange={(e) => setDate(e.target.value)}
        className="border p-2"
        onKeyDown={(e) => e.preventDefault()}
      />

      <input
        type="time"
        min="08:00"
        max="22:00"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <input
        type="time"
        min="08:00"
        max="22:00"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button
        onClick={addAppointment}
        className="bg-green-500 text-white p-2 rounded"
      >
        Create Appointment
      </button>
    </div>
  );
}
