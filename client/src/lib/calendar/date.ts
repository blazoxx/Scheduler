export function combineDateAndTime(
  date: string,
  time: string
) {
  return new Date(`${date}T${time}`);
}

export function formatUTC(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}