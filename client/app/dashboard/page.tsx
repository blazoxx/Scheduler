"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

import AvailabilityForm from "@/src/components/AvailabilityForm";
import AvailabilityList from "@/src/components/AvailabilityList";
import AppointmentForm from "@/src/components/AppointmentForm";
import AppointmentList from "@/src/components/AppointmentList";
import DashboardCards from "@/src/components/DashboardCards";
// import BookingLinkCard from "@/src/components/dashboard/BookingLinkCard";
import PendingRequests from "@/src/components/PendingRequests";
import PageContainer from "@/src/components/layout/PageContainer";
import SectionHeader from "@/src/components/layout/SectionHeader";
import Button from "@/src/components/ui/button";
import Badge from "@/src/components/ui/badge";
import { Card, CardBody } from "@/src/components/ui/card";

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [today, setToday] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [username, setUsername] = useState("");

  const fetchStats = useCallback(async () => {
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
  }, []);

  const checkSession = useCallback(async () => {
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
  }, [fetchStats, router]);

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
  }, [checkSession]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return <div className="p-8 text-slate-600">Checking permissions...</div>;
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-96 w-96 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="absolute -right-28 bottom-10 h-120 w-120 rounded-full bg-sky-300/15 blur-3xl" />
      </div>

      <PageContainer className="relative py-8 sm:py-10 lg:py-14">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 rounded-4xl border border-slate-200/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge variant="success">Host dashboard</Badge>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Welcome back{username ? `, ${username}` : ""}.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Monitor bookings, manage availability, and keep the host experience polished from
                  one consistent interface.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {username ? (
                <Link
                  href={`/book/${username}`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Open public page
                </Link>
              ) : null}

              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          <DashboardCards
            today={today}
            upcoming={upcoming}
            completed={completed}
            cancelled={cancelled}
          />

          <section className="space-y-4">
            <SectionHeader
              eyebrow="Scheduling tools"
              title="Availability and appointments"
              description="Use the same interface to set working hours, create appointments, and review incoming requests."
            />

            <div className="grid items-stretch gap-4 xl:grid-cols-2">
              <Card className="flex h-[44rem] flex-col overflow-hidden">
                <CardBody className="flex h-full flex-col space-y-4 p-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                      Availability
                    </h2>
                    <p className="text-sm leading-6 text-slate-600">
                      Define working windows with a cleaner card layout.
                    </p>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <AvailabilityForm />
                    <AvailabilityList />
                  </div>
                </CardBody>
              </Card>

              <Card className="flex h-[44rem] flex-col overflow-hidden">
                <CardBody className="flex h-full flex-col space-y-4 p-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                      Appointment creation
                    </h2>
                    <p className="text-sm leading-6 text-slate-600">
                      Create and confirm sessions without the page feeling cramped.
                    </p>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <AppointmentForm />
                  </div>
                </CardBody>
              </Card>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardBody className="space-y-4 p-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Pending requests
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">
                    Review and approve incoming appointments with stronger visual separation.
                  </p>
                </div>
                <PendingRequests />
              </CardBody>
            </Card>

            <Card>
              <CardBody className="space-y-4 p-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Appointment history
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">
                    Keep the full timeline visible without overwhelming the page.
                  </p>
                </div>
                <AppointmentList />
              </CardBody>
            </Card>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
