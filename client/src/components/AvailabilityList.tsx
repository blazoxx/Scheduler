"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";
import Badge from "@/src/components/ui/badge";

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

    const channel = supabase
      .channel("availability-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "availability",
        },
        (payload) => {
          console.log("Availability Realtime:", payload);
          fetchSlots();
        },
      )
      .subscribe((status) => {
        console.log("Availability channel:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
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
    <div className="mt-6 space-y-3">
      {slots.length === 0 ? (
        <Card>
          <CardBody className="p-5 text-sm text-slate-600">No availability slots yet.</CardBody>
        </Card>
      ) : (
        slots.map((slot) => (
          <Card key={slot.id}>
            <CardBody className="flex items-center justify-between gap-4 p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-slate-950">{DAYS[slot.day_of_week]}</p>
                  <Badge variant="neutral">Weekly</Badge>
                </div>
                <p className="text-sm text-slate-600">
                  {slot.start_time} - {slot.end_time}
                </p>
              </div>

              <Button variant="danger" size="sm" onClick={() => deleteSlot(slot.id)}>
                Delete
              </Button>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
}
