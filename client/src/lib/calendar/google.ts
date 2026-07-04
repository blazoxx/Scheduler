type GoogleCalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
};

function formatGoogleDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function generateGoogleCalendarLink({
  title,
  description = "",
  location = "",
  start,
  end,
}: GoogleCalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    location,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}