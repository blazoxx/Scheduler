"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookAppointment } from "@/src/lib/bookAppointment";

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
    <div className="space-y-4 border rounded p-6 mt-6">
      <h2 className="text-2xl font-semibold">Book Appointment</h2>

      <input
        required
        placeholder="Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="w-full border rounded p-2"
      />

      <input
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded p-2"
      />

      <input
        required
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2"
      />

      <div>Date: {selectedDate}</div>

      <div>Time: {selectedSlot}</div>

      <button
        disabled={
          loading || !clientName.trim() || !email.trim() || !title.trim()
        }
        onClick={handleSubmit}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
}

export default function PublicBookingForm(props: Props) {
  const formKey = props.appointmentToReschedule?.id ?? "new";

  return <BookingFormContent key={formKey} {...props} />;
}
