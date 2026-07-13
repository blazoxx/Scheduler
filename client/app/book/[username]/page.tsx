import { notFound } from "next/navigation";
import { getUserByUsername } from "@/src/lib/profile";
import PageContainer from "@/src/components/layout/PageContainer";
import Badge from "@/src/components/ui/badge";
import { Card, CardBody } from "@/src/components/ui/card";
import BookingCalendar from "@/src/components/BookingCalendar";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  let profile: Awaited<ReturnType<typeof getUserByUsername>>;

  try {
    profile = await getUserByUsername(username);
  } catch (err) {
    console.error("PAGE ERROR:", err);
    throw err;
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-120 w-120 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <PageContainer className="relative py-8 sm:py-10 lg:py-14">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 rounded-4xl border border-slate-200/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge variant="info">Public booking page</Badge>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {profile.full_name}
                </h1>
                <p className="text-base text-slate-600">@{profile.username}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Fast", "Find a slot quickly"],
                ["Clear", "Strong booking hierarchy"],
                ["Premium", "Feels polished on arrival"],
              ].map(([title, description]) => (
                <Card key={title}>
                  <CardBody className="space-y-1 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                      {title}
                    </p>
                    <p className="text-sm leading-6 text-slate-600">{description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <BookingCalendar
            userId={profile.id}
            username={profile.username}
            fullName={profile.full_name}
            email={profile.email}
          />
        </div>
      </PageContainer>
    </main>
  );
}
