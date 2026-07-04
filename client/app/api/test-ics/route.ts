import { NextResponse } from "next/server";
import { generateICS } from "@/src/lib/calendar/ics";

export async function GET() {
  const ics = generateICS({
    title: "Scheduler Test",
    description: "Testing ICS generation",
    location: "https://meet.google.com/test",
    start: new Date("2026-07-05T10:00:00Z"),
    end: new Date("2026-07-05T10:30:00Z"),
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition":
        'attachment; filename="test.ics"',
    },
  });
}