"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import Badge from "@/src/components/ui/badge";

export default function AppointmentForm() {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  async function addAppointment() {
    if (!clientName || !email || !title || !date || !startTime || !endTime) {
      setStatusMessage("Please fill all fields.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      setStatusMessage("Past dates are not allowed.");
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
      setStatusMessage(error.message);
      return;
    }

    setClientName("");
    setEmail("");
    setTitle("");
    setStartTime("");
    setEndTime("");
    setStatusMessage("Appointment created successfully.");

    if (user && date) {
      const response = await fetch("/api/available-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          date,
          duration: 30,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAvailableSlots(data.slots);
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Badge variant="info" className="w-fit">Manual booking</Badge>

      <div className="grid gap-4">
        <Input
          type="text"
          placeholder="Client name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={date}
          onChange={async (e) => {
            const selectedDate = e.target.value;

            setDate(selectedDate);
            setStartTime("");
            setEndTime("");
            setStatusMessage("");

            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (user && selectedDate) {
              const response = await fetch("/api/available-slots", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: user.id,
                  date: selectedDate,
                  duration: 30,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                setAvailableSlots(data.slots);
              }
            }
          }}
        />

        <Select
          value={startTime}
          onChange={(e) => {
            const selected = e.target.value;

            setStartTime(selected);

            const [h, m] = selected.split(":").map(Number);

            const totalMinutes = h * 60 + m + 30;

            const endH = Math.floor(totalMinutes / 60)
              .toString()
              .padStart(2, "0");

            const endM = (totalMinutes % 60).toString().padStart(2, "0");

            setEndTime(`${endH}:${endM}`);
          }}
        >
          <option value="">Select time</option>
          {availableSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </Select>
      </div>

      {date && availableSlots.length === 0 ? (
        <p className="text-sm text-amber-700">No slots available for this date.</p>
      ) : null}

      {endTime ? <p className="text-sm text-slate-600">Ends at: {endTime}</p> : null}

      {statusMessage ? <p className="text-sm text-slate-600">{statusMessage}</p> : null}

      <Button onClick={addAppointment} disabled={!startTime}>
        Create Appointment
      </Button>
    </div>
  );
}
