type ScheduleRequest = {
  title: string;
  duration: number;
  date: string;
  preferred_period: "morning" | "afternoon" | "evening";
};

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);

  const total = hours * 60 + mins + minutes;

  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60
  ).padStart(2, "0")}`;
}

export function findBestSlot(
  slots: string[],
  data: ScheduleRequest
) {
  let filteredSlots = slots;

  if (data.preferred_period === "morning") {
    filteredSlots = slots.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour < 12;
    });
  }

  if (data.preferred_period === "afternoon") {
    filteredSlots = slots.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour >= 13 && hour < 17;
    });
  }

  if (data.preferred_period === "evening") {
    filteredSlots = slots.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour >= 17;
    });
  }

  if (!filteredSlots.length) {
    return null;
  }

  const startTime = filteredSlots[0];

  return {
    title: data.title,
    date: data.date,
    start_time: startTime,
    end_time: addMinutes(
      startTime,
      data.duration
    ),
    duration: data.duration,
  };
}