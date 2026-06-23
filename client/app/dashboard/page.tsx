"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import AvailabilityForm from "@/src/components/AvailabilityForm";
import AvailabilityList from "@/src/components/AvailabilityList";
import AppointmentForm from "@/src/components/AppointmentForm";
import AppointmentList from "@/src/components/AppointmentList";

export default function Dashboard() {
  const router = useRouter();

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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl">Dashboard</h1>

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
