"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookAppointment } from "@/src/lib/bookAppointment";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";
import { Card, CardBody } from "@/src/components/ui/card";
import Badge from "@/src/components/ui/badge";

type Props = {
  userId: string;
  username: string;
  selectedDate: string;
  selectedSlot: string;

  appointmentToReschedule?: {
    id: string;
    client_name: string;
    email: string;
    title: string;
  } | null;
};

type BookingFormContentProps = Props;

function BookingFormContent({
  userId,
  username,
  selectedDate,
  selectedSlot,
  appointmentToReschedule,
}: BookingFormContentProps) {
  const router = useRouter();

  const [clientName, setClientName] = useState(
    appointmentToReschedule?.client_name ?? "",
  );
  const [email, setEmail] = useState(appointmentToReschedule?.email ?? "");
  const [title, setTitle] = useState(appointmentToReschedule?.title ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!clientName.trim() || !email.trim() || !title.trim()) {
      alert("Please fill all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Enter a valid email address.");
      return;
    }

    if (loading) return;

    setLoading(true);

    const { error, endTime } = await bookAppointment({
      userId,
      clientName,
      email,
      title,
      date: selectedDate,
      startTime: selectedSlot,
      duration: 30,
      oldAppointmentId: appointmentToReschedule?.id,
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
    <Card className="mt-6">
      <CardBody className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="info">Booking form</Badge>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Book Appointment
            </h2>
          </div>
          <div className="text-sm text-slate-500">
            Date: {selectedDate} · Time: {selectedSlot}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input required placeholder="Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <Input required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <Button
          disabled={loading || !clientName.trim() || !email.trim() || !title.trim()}
          onClick={handleSubmit}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </CardBody>
    </Card>
  );
}

export default function PublicBookingForm(props: Props) {
  const formKey = props.appointmentToReschedule?.id ?? "new";

  return <BookingFormContent key={formKey} {...props} />;
}
