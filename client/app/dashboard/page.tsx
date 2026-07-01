"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

import AvailabilityForm from "@/src/components/AvailabilityForm";
import AvailabilityList from "@/src/components/AvailabilityList";
import AppointmentForm from "@/src/components/AppointmentForm";
import AppointmentList from "@/src/components/AppointmentList";
import DashboardCards from "@/src/components/DashboardCards";
import BookingLinkCard from "@/src/components/dashboard/BookingLinkCard";
import PendingRequests from "@/src/components/PendingRequests";

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [today, setToday] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [username, setUsername] = useState("");

  async function fetchStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profile) {
      setUsername(profile.username);
    }

    const todayDate = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("appointments")
      .select("date,status")
      .eq("user_id", user.id);

    const appointments = data || [];

    setToday(
      appointments.filter(
        (a) => a.status === "scheduled" && a.date === todayDate,
      ).length,
    );

    setUpcoming(
      appointments.filter(
        (a) => a.status === "scheduled" && a.date >= todayDate,
      ).length,
    );

    setCompleted(appointments.filter((a) => a.status === "completed").length);

    setCancelled(appointments.filter((a) => a.status === "cancelled").length);
  }

  async function checkSession() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role,is_verified")
      .eq("id", user.id)
      .single();

    if (error || !profile || profile.role !== "host" || !profile.is_verified) {
      router.replace("/my-bookings");
      return;
    }

    await fetchStats();
  }

  useEffect(() => {
    let active = true;

    (async () => {
      await checkSession();

      if (active) {
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return <div className="p-8">Checking permissions...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl">Dashboard</h1>

      <DashboardCards
        today={today}
        upcoming={upcoming}
        completed={completed}
        cancelled={cancelled}
      />

      {username && <BookingLinkCard username={username} />}

      <AvailabilityForm />
      <AvailabilityList />

      <AppointmentForm />
      
      <PendingRequests />
      
      <AppointmentList />

      <button
        onClick={handleLogout}
        className="mt-5 rounded bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  );
}
