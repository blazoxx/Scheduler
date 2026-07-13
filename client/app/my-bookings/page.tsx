"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import AIScheduler from "@/src/components/AIScheduler";
import BookingCard from "@/src/components/BookingCard";
import type { Appointment } from "@/src/types/appointment";
import PageContainer from "@/src/components/layout/PageContainer";
import SectionHeader from "@/src/components/layout/SectionHeader";
import Badge from "@/src/components/ui/badge";
import { Card, CardBody } from "@/src/components/ui/card";

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

  const schedulerRef = useRef<HTMLDivElement>(null);

  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<Appointment | null>(null);

  function handleReschedule(appointment: Appointment) {
    setAppointmentToReschedule(appointment);

    schedulerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

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
      if (mounted.current) {
        setLoading(false);
      }
      return;
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("email", user.email)
      .order("date", { ascending: true });

    if (error) {
      console.error(error);

      if (mounted.current) {
        setLoading(false);
      }

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
      await Promise.all([
        fetchProfile(),
        fetchBookings(),
        fetchHosts(),
      ]);
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
        }
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
    return <div className="p-8 text-slate-600">Loading bookings...</div>;
  }

  const today = new Date().toISOString().split("T")[0];

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "scheduled" &&
      appointment.date >= today
  );

  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status === "rejected"
  );

  const historyAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "completed" ||
      appointment.status === "cancelled" ||
      (appointment.status === "scheduled" &&
        appointment.date < today)
  );

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-96 w-96 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-120 w-120 rounded-full bg-sky-300/15 blur-3xl" />
      </div>

      <PageContainer className="relative py-8 sm:py-10 lg:py-14">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 rounded-4xl border border-slate-200/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge variant="info">Guest dashboard</Badge>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  My Bookings
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Track pending requests, upcoming sessions, and booking history from one polished
                  view.
                </p>
              </div>
            </div>

            <Link
              href="#scheduler"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Jump to scheduler
            </Link>
          </div>

          <div id="scheduler" ref={schedulerRef}>
            <AIScheduler
              hosts={hosts}
              fullName={guestName}
              email={guestEmail}
              appointmentToReschedule={appointmentToReschedule}
              clearReschedule={() => setAppointmentToReschedule(null)}
            />
          </div>

          <section className="space-y-4">
            <SectionHeader
              eyebrow="Bookings"
              title="Your appointment timeline"
              description="Everything is grouped by status so the page is easier to scan on mobile and desktop."
            />

            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardBody className="space-y-4 p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Pending Approval
                  </h2>
                  <div className="space-y-4">
                    {pendingAppointments.length === 0 ? (
                      <p className="text-sm text-slate-500">No pending requests.</p>
                    ) : (
                      pendingAppointments.map((appointment) => (
                        <BookingCard key={appointment.id} appointment={appointment} />
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="space-y-4 p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Upcoming Bookings
                  </h2>
                  <div className="space-y-4">
                    {upcomingAppointments.length === 0 ? (
                      <p className="text-sm text-slate-500">No upcoming bookings.</p>
                    ) : (
                      upcomingAppointments.map((appointment) => (
                        <BookingCard
                          key={appointment.id}
                          appointment={appointment}
                          onReschedule={handleReschedule}
                        />
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardBody className="space-y-4 p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Rejected Requests
                  </h2>
                  <div className="space-y-4">
                    {rejectedAppointments.length === 0 ? (
                      <p className="text-sm text-slate-500">No rejected requests.</p>
                    ) : (
                      rejectedAppointments.map((appointment) => (
                        <BookingCard key={appointment.id} appointment={appointment} />
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="space-y-4 p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                    Booking History
                  </h2>
                  <div className="space-y-4">
                    {historyAppointments.length === 0 ? (
                      <p className="text-sm text-slate-500">No booking history.</p>
                    ) : (
                      historyAppointments.map((appointment) => (
                        <BookingCard key={appointment.id} appointment={appointment} />
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}