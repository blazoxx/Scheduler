import { combineDateAndTime, formatUTC } from "./date";

type GoogleCalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone?: string | null;
};

export function generateGoogleCalendarLink({
  title,
  description = "",
  location = "",
  date,
  startTime,
  endTime,
}: GoogleCalendarEvent) {
  const start = combineDateAndTime(date, startTime);
  const end = combineDateAndTime(date, endTime);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    location,
    dates: `${formatUTC(start)}/${formatUTC(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}