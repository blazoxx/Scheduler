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

function scoreByDistance(
  actual: number,
  preferred: number
) {
  const distance = Math.abs(actual - preferred);

  // Lose 1 point every 10 minutes away
  return Math.max(0, 25 - Math.floor(distance / 10));
}

function calculateScore(
  slot: string,
  data: ScheduleRequest
) {
  let score = 0;

  const minutes = toMinutes(slot);


  //--------------------------------------------------
  // Preferred period
  //--------------------------------------------------

  const hour = Math.floor(minutes / 60);

  if (
    data.preferred_period === "morning" &&
    hour < 12
  ) {
    score += 40;
  }

  if (
    data.preferred_period === "afternoon" &&
    hour >= 12 &&
    hour < 17
  ) {
    score += 40;
  }

  if (
    data.preferred_period === "evening" &&
    hour >= 17 &&
    hour < 20
  ) {
    score += 40;
  }

  if (
    data.preferred_period === "night" &&
    hour >= 20
  ) {
    score += 40;
  }

  //--------------------------------------------------
  // Earliest requested time
  //--------------------------------------------------

  if (data.earliest_time) {

    const earliest = toMinutes(
      data.earliest_time
    );

    if (minutes >= earliest) {
      score += scoreByDistance(
        minutes,
        earliest
      );
    }
  }

  //--------------------------------------------------
  // Latest requested time
  //--------------------------------------------------

  if (data.latest_time) {

    const latest = toMinutes(
      data.latest_time
    );

    if (
      minutes + data.duration <= latest
    ) {

      score += scoreByDistance(
        minutes + data.duration,
        latest
      );

    }
  }

  //--------------------------------------------------
  // Earlier slots get slightly higher score
  //--------------------------------------------------

  if (
    !data.earliest_time &&
    !data.latest_time
  ) {
    score +=
      Math.max(
        0,
        10 - Math.floor(minutes / 120)
      );
  }

  return score;
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
      .map((slot) => ({
        title: data.title,
        date: data.date,
        start_time: slot,
        end_time: addMinutes(slot, data.duration),
        duration: data.duration,
        score: calculateScore(slot, data),
      }))
      .sort((a, b) => Number(b.score) - Number(a.score))
      .slice(0, 3);

    return {
      exactMatch: true,
      suggestions,
    };
  }

  //--------------------------------------------------
  // Fallback Suggestions
  //--------------------------------------------------

  const alternatives = slots
    .map((slot) => ({
      title: data.title,
      date: data.date,
      start_time: slot,
      end_time: addMinutes(slot, data.duration),
      duration: data.duration,
      score: calculateScore(slot, data),
    }))
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, 3);

  return {
    exactMatch: false,
    message: `No ${data.preferred_period ?? ""} slots were available. Showing the closest available alternatives.`,
    suggestions: alternatives,
  };
}