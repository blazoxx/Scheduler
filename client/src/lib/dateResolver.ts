const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type Relative =
  | "today"
  | "tomorrow"
  | "this"
  | "next"
  | "coming"
  | null;

export function resolveDate(
  weekday: string | null,
  relative: Relative
): string {
  const today = new Date();

  // Handle "today"
  if (relative === "today") {
    return today.toISOString().split("T")[0];
  }

  // Handle "tomorrow"
  if (relative === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return tomorrow.toISOString().split("T")[0];
  }

  // If no weekday, default to today
  if (!weekday) {
    return today.toISOString().split("T")[0];
  }

  const targetDay = DAYS.indexOf(
    weekday.toLowerCase() as (typeof DAYS)[number]
  );

  if (targetDay === -1) {
    throw new Error(`Invalid weekday: ${weekday}`);
  }

  const currentDay = today.getDay();

  let diff = targetDay - currentDay;

  // Always choose the next occurrence
  if (diff <= 0) {
    diff += 7;
  }

  const result = new Date(today);
  result.setDate(today.getDate() + diff);

  return result.toISOString().split("T")[0];
}