"use client";

import { useEffect, useState } from "react";
import PublicBookingForm from "./PublicBookingForm";
import AIScheduler from "./AIScheduler";
import Badge from "@/src/components/ui/badge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";
import Input from "@/src/components/ui/input";

type Props = {
  userId: string;
  username: string;
  fullName: string;
  email: string;
};

export default function BookingCalendar({
  userId,
  username,
  fullName,
  email,
}: Props) {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    if (!selectedDate) return;

    async function loadSlots() {
      setLoading(true);

      const response = await fetch("/api/available-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          date: selectedDate,
          duration: 30,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load slots");
      }

      setSlots(data.slots);
    }

    loadSlots();
  }, [selectedDate, userId]);

  return (
    <div className="space-y-4">
      <AIScheduler
        userId={userId}
        username={username}
        fullName={fullName}
        email={email}
        appointmentToReschedule={null}
        clearReschedule={() => {}}
      />

      <Card>
        <CardBody className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="info">Availability</Badge>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Choose a date and time
              </h3>
            </div>
            <p className="text-sm text-slate-500">Pick a date to load live slots</p>
          </div>

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {loading && <p className="text-sm text-slate-500">Loading slots...</p>}

          {!loading && slots.length === 0 && selectedDate && (
            <p className="text-sm text-slate-500">No slots available</p>
          )}

          <div className="flex flex-wrap gap-3">
            {slots.map((slot) => (
              <Button
                key={slot}
                variant={selectedSlot === slot ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>

      {selectedSlot && (
        <PublicBookingForm
          userId={userId}
          username={username}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
        />
      )}
    </div>
  );
}
