type ScheduleRequest = {
  title: string;
  duration: number;
  date: string;

  preferred_period?:
    | "morning"
    | "afternoon"
    | "evening"
    | "night";

  earliest_time?: string | null;
  latest_time?: string | null;
};

export type SlotSuggestion = {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  score: number;
};

export type SlotResult = {
  exactMatch: boolean;
  message?: string;
  suggestions: SlotSuggestion[];
};

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);

  const total = hours * 60 + mins + minutes;

  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60
  ).padStart(2, "0")}`;
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);

  return h * 60 + m;
}

export function findBestSlot(
  slots: string[],
  data: ScheduleRequest
): SlotResult {

  if (!slots.length) {
    return {
      exactMatch: false,
      message: "No available slots found.",
      suggestions: [],
    };
  }

  let filtered = [...slots];

  //--------------------------------------------------
  // Morning / Afternoon / Evening / Night
  //--------------------------------------------------

  if (data.preferred_period === "morning") {
    filtered = filtered.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour < 12;
    });
  }

  if (data.preferred_period === "afternoon") {
    filtered = filtered.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour >= 12 && hour < 17;
    });
  }

  if (data.preferred_period === "evening") {
    filtered = filtered.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour >= 17 && hour < 20;
    });
  }

  if (data.preferred_period === "night") {
    filtered = filtered.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour >= 20;
    });
  }

  //--------------------------------------------------
  // After X
  //--------------------------------------------------

  if (data.earliest_time) {
    const earliest = toMinutes(data.earliest_time);

    filtered = filtered.filter(
      (slot) => toMinutes(slot) >= earliest
    );
  }

  //--------------------------------------------------
  // Before X
  //--------------------------------------------------

  if (data.latest_time) {
    const latest = toMinutes(data.latest_time);

    filtered = filtered.filter(
      (slot) =>
        toMinutes(addMinutes(slot, data.duration)) <= latest
    );
  }

  //--------------------------------------------------
  // Exact Match
  //--------------------------------------------------

  if (filtered.length) {

    const suggestions = filtered
      .slice(0, 3)
      .map((slot, index) => ({
        title: data.title,
        date: data.date,
        start_time: slot,
        end_time: addMinutes(slot, data.duration),
        duration: data.duration,
        score: 100 - index,
      }));

    return {
      exactMatch: true,
      suggestions,
    };
  }

  //--------------------------------------------------
  // Fallback Suggestions
  //--------------------------------------------------

  const alternatives = slots
    .slice(-3)
    .reverse()
    .map((slot, index) => ({
      title: data.title,
      date: data.date,
      start_time: slot,
      end_time: addMinutes(slot, data.duration),
      duration: data.duration,
      score: 100 - index,
    }));

  return {
    exactMatch: false,
    message: `No ${data.preferred_period ?? ""} slots were available. Showing the closest available alternatives.`,
    suggestions: alternatives,
  };
}