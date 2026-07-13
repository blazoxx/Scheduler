import { generateICS } from "@/src/lib/calendar/ics";

const ics = generateICS({
  title: "Scheduler Test",
  description: "Testing ICS",
  location: "https://meet.google.com/test",
  start: new Date("2026-07-10T10:00:00Z"),
  end: new Date("2026-07-10T10:30:00Z"),
});

console.log(ics);