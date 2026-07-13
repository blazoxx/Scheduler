import Link from "next/link";
import PageContainer from "@/src/components/layout/PageContainer";
import Badge from "@/src/components/ui/badge";
import Button from "@/src/components/ui/button";
import { Card, CardBody } from "@/src/components/ui/card";

type Props = {
  searchParams: Promise<{
    username: string;
    date: string;
    start: string;
    end: string;
    email: string;
  }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { username, date, start, end, email } = await searchParams;

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      <PageContainer className="relative flex min-h-screen items-center justify-center py-12">
        <Card className="w-full max-w-2xl">
          <CardBody className="space-y-6 p-6 sm:p-8">
            <div className="space-y-3 text-center">
              <Badge variant="success" className="mx-auto">
                Booking confirmed
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Appointment booked successfully
              </h1>
              <p className="mx-auto max-w-xl text-base leading-7 text-slate-600">
                Your session is locked in and the booking experience now has a polished landing
                point to match.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Date", date],
                ["Time", `${start} - ${end}`],
                ["Email", email],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-950">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href={`/book/${username}`} className="inline-flex">
                <Button size="lg" className="w-full sm:w-auto">
                  Book another
                </Button>
              </Link>
              <a
                href={`mailto:${email}`}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Email confirmation
              </a>
            </div>
          </CardBody>
        </Card>
      </PageContainer>
    </main>
  );
}
