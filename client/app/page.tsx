import Link from "next/link";
import PageContainer from "@/src/components/layout/PageContainer";
import SectionHeader from "@/src/components/layout/SectionHeader";
import Badge from "@/src/components/ui/badge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";

const stats = [
  { value: "2 min", label: "to launch a booking page" },
  { value: "24/7", label: "availability for clients" },
  { value: "+38%", label: "more completed bookings" },
];

const features = [
  {
    title: "Clean booking flow",
    description:
      "Guests land on a polished booking page with clear availability, fewer clicks, and a calm interface that feels premium.",
  },
  {
    title: "Host dashboard that reads fast",
    description:
      "Appointments, availability, and pending requests are organized with stronger hierarchy so the product feels easier to trust.",
  },
  {
    title: "AI scheduling with visual clarity",
    description:
      "The AI-assisted flow surfaces suggestions, confidence, and next steps in a way that feels modern instead of technical.",
  },
];

const highlights = [
  "Glassmorphism surfaces",
  "Strong typography hierarchy",
  "Teal + slate palette",
  "Responsive card grids",
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 -top-40 h-112 w-md -translate-x-1/2 rounded-full bg-teal-300/25 blur-3xl" />
        <div className="absolute -right-24 top-72 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -left-32 -bottom-28 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      <PageContainer className="relative py-8 sm:py-10 lg:py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="flex items-center justify-between rounded-full border border-slate-200/70 bg-white/70 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-700 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,118,110,0.25)]">
                S
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Scheduler</p>
                <p className="text-xs text-slate-500">Premium booking experience</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <Badge variant="info">Production-ready UI</Badge>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sign in
              </Link>
            </div>
          </header>

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                AI-assisted appointment scheduling that looks premium
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  A booking frontend that feels like a high-end product.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Turn a functional scheduler into a polished SaaS experience with stronger visual
                  hierarchy, softer surfaces, and a landing page that makes the whole app feel
                  deliberate.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex">
                  <Button size="lg" className="min-w-44">
                    Create account
                  </Button>
                </Link>
                <Link href="/login" className="inline-flex">
                  <Button size="lg" variant="secondary" className="min-w-44">
                    Open dashboard
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                {highlights.map((item) => (
                  <Badge key={item} variant="neutral">
                    {item}
                  </Badge>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <Card key={stat.label}>
                    <CardBody className="space-y-1 p-5">
                      <p className="text-2xl font-semibold tracking-tight text-slate-950">
                        {stat.value}
                      </p>
                      <p className="text-sm leading-6 text-slate-600">{stat.label}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="relative overflow-hidden border-slate-200/80 bg-white/85">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(20,184,166,0.08),transparent_45%),radial-gradient(circle_at_top_right,rgba(148,163,184,0.2),transparent_30%)]" />
              <CardBody className="relative space-y-6 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Today’s overview</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                      12 bookings
                    </p>
                  </div>
                  <Badge variant="success">+18% this week</Badge>
                </div>

                <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Next available slot</p>
                      <p className="mt-1 text-lg font-semibold text-slate-950">Thu, 3:30 PM</p>
                    </div>
                    <div className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
                      Confirmed
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Host
                      </p>
                      <p className="mt-2 font-medium text-slate-950">Jordan Lee</p>
                      <p className="text-sm text-slate-600">Design consult</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Session
                      </p>
                      <p className="mt-2 font-medium text-slate-950">45 minutes</p>
                      <p className="text-sm text-slate-600">Video call</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-linear-to-r from-teal-700 to-cyan-600 p-5 text-white shadow-[0_18px_40px_rgba(15,118,110,0.22)]">
                    <p className="text-sm/6 text-teal-50">AI scheduling insight</p>
                    <p className="mt-2 text-lg font-medium">
                      The next best slot is already highlighted for the guest.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group h-full transition-transform duration-300 hover:-translate-y-1">
                <CardBody className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(15,23,42,0.15)]">
                      0{index + 1}
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                      Feature
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                      {feature.title}
                    </h2>
                    <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <Card>
              <CardBody className="space-y-4 p-6">
                <SectionHeader
                  eyebrow="Why it works"
                  title="The interface has room to breathe."
                  description="Large type, consistent spacing, and clear surfaces make the app feel more expensive without adding clutter."
                />
                <div className="space-y-3 pt-2 text-sm leading-6 text-slate-600">
                  <p>
                    The hero immediately communicates value, the cards carry hierarchy, and the
                    accent color stays controlled instead of overwhelming the page.
                  </p>
                  <p>
                    This is the same product, but the presentation now feels intentional enough
                    for recruiters, clients, and a real production launch.
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card className="overflow-hidden">
              <div className="grid h-full gap-px bg-slate-200/70 sm:grid-cols-2">
                <div className="bg-white p-6">
                  <p className="text-sm font-semibold text-slate-500">Visual direction</p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    Calm, premium, and focused
                  </p>
                </div>
                <div className="bg-white p-6">
                  <p className="text-sm font-semibold text-slate-500">Primary goal</p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    Make the app feel obviously better
                  </p>
                </div>
                <div className="bg-white p-6">
                  <p className="text-sm font-semibold text-slate-500">UI ingredients</p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    Glass cards, soft shadows, strong contrast
                  </p>
                </div>
                <div className="bg-white p-6">
                  <p className="text-sm font-semibold text-slate-500">Next milestone</p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    Upgrade login, signup, and dashboard pages
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}