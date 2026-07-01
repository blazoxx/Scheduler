"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import AIScheduler from "@/src/components/AIScheduler";
import BookingCard from "@/src/components/BookingCard";

type Appointment = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  client_name: string;
};

type Host = {
  id: string;
  username: string;
  full_name: string;
};

export default function MyBookingsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const mounted = useRef(true);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("full_name,email")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (!mounted.current) return;

    if (profile) {
      setGuestName(profile.full_name);
      setGuestEmail(profile.email);
    }
  }

  async function fetchBookings() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (!mounted.current) return;

      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("email", user.email)
      .order("date", { ascending: true });

    if (error) {
      console.error(error);

      if (!mounted.current) return;

      setLoading(false);
      return;
    }

    if (!mounted.current) return;

    setAppointments(data ?? []);
    setLoading(false);
  }
  useEffect(() => {
    mounted.current = true;

    async function fetchHosts() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .eq("role", "host")
        .eq("is_verified", true)
        .order("full_name");

      if (error) {
        console.error(error);
        return;
      }

      if (!mounted.current) return;

      setHosts(data ?? []);
    }

    async function initialize() {
      await Promise.all([fetchProfile(), fetchBookings(), fetchHosts()]);
    }

    initialize();

    const channel = supabase
      .channel("guest-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        () => {
          fetchBookings();
        },
      )
      .subscribe((status) => {
        console.log("Guest channel:", status);
      });

    return () => {
      mounted.current = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="p-8">Loading bookings...</div>;
  }

  const today = new Date().toISOString().split("T")[0];

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  );

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "scheduled" && appointment.date >= today,
  );

  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status === "rejected",
  );

  const historyAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "completed" ||
      appointment.status === "cancelled" ||
      (appointment.status === "scheduled" && appointment.date < today),
  );

  return (
    <div className="p-8">
      <AIScheduler hosts={hosts} fullName={guestName} email={guestEmail} />

      <h1 className="text-4xl font-bold mb-6 mt-6">My Bookings</h1>

      <hr className="mb-6 border-gray-300" />

      <div className="mt-10 space-y-12">
        {/* Pending */}

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Pending Approval</h2>

          <div className="space-y-4">
            {pendingAppointments.length === 0 ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              pendingAppointments.map((appointment) => (
                <BookingCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </div>
        </section>

        {/* Upcoming */}

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Upcoming Bookings</h2>

          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming bookings.</p>
            ) : (
              upcomingAppointments.map((appointment) => (
                <BookingCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </div>
        </section>

        {/* Rejected */}

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Rejected Requests</h2>

          <div className="space-y-4">
            {rejectedAppointments.length === 0 ? (
              <p className="text-gray-500">No rejected requests.</p>
            ) : (
              rejectedAppointments.map((appointment) => (
                <BookingCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </div>
        </section>

        {/* History */}

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Booking History</h2>

          <div className="space-y-4">
            {historyAppointments.length === 0 ? (
              <p className="text-gray-500">No booking history.</p>
            ) : (
              historyAppointments.map((appointment) => (
                <BookingCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
