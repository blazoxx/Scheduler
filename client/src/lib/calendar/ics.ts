import { combineDateAndTime, formatUTC } from "./date";

type ICSEvent = {
  title: string;
  description?: string;
  location?: string;

  date: string;
  startTime: string;
  endTime: string;

  timezone?: string | null;
};

export function generateICS({
  title,
  description = "",
  location = "",
  date,
  startTime,
  endTime,
}: ICSEvent) {
  const start = combineDateAndTime(date, startTime);
  const end = combineDateAndTime(date, endTime);

  const uid = `${Date.now()}@scheduler`;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Scheduler//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatUTC(new Date())}
DTSTART:${formatUTC(start)}
DTEND:${formatUTC(end)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
}