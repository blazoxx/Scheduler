"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import AvailabilityForm from "@/src/components/AvailabilityForm";
import AvailabilityList from "@/src/components/AvailabilityList";
import AppointmentForm from "@/src/components/AppointmentForm";
import AppointmentList from "@/src/components/AppointmentList";
import DashboardCards from "@/src/components/DashboardCards";
import BookingLinkCard from "@/src/components/dashboard/BookingLinkCard";

export default function Dashboard() {
  const router = useRouter();
  const [today, setToday] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      }
    }

    checkSession();
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

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

    setToday(appointments.filter((a) => a.date === todayDate).length);

    setUpcoming(appointments.filter((a) => a.date > todayDate).length);

    setCompleted(appointments.filter((a) => a.status === "completed").length);

    setCancelled(appointments.filter((a) => a.status === "cancelled").length);
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
      <AppointmentList />

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mt-5"
      >
        Logout
      </button>

    </div>
  );
}
