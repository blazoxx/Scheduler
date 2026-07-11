import { generateGoogleCalendarLink } from "@/src/calendar/google";

const link = generateGoogleCalendarLink({
  title: "Scheduler Test Meeting",
  description: "Testing Google Calendar integration",
  location: "https://meet.google.com/test-abc-def",
  start: new Date("2026-07-10T10:00:00Z"),
  end: new Date("2026-07-10T10:30:00Z"),
});

console.log("Google Calendar Link:");
console.log(link);