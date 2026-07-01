"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import AIScheduler from "@/src/components/AIScheduler";

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

  useEffect(() => {
    async function fetchBookings() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name,email")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
      } else if (profile) {
        setGuestName(profile.full_name);
        setGuestEmail(profile.email);
      }

      console.log("CURRENT USER:", user);

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("email", user.email)
        .order("date", { ascending: true });

      console.log(data);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setAppointments(data ?? []);
      setLoading(false);
    }

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

      setHosts(data ?? []);
    }

    fetchBookings();
    fetchHosts();
  }, []);

  if (loading) {
    return <div className="p-8">Loading bookings...</div>;
  }

  console.log(appointments);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">My Bookings</h1>

      <AIScheduler hosts={hosts} fullName={guestName} email={guestEmail} />

      <hr className="my-8" />

      <pre>{JSON.stringify(appointments, null, 2)}</pre>
    </div>
  );
}
