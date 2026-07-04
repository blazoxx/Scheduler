type ICSEvent = {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
};

function formatICSDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function generateICS({
  title,
  description = "",
  location = "",
  start,
  end,
}: ICSEvent) {
  const uid = `${Date.now()}@scheduler`;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Scheduler//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}