export const OPENING_HOURS = {
  monday: { open: 8, close: 22 },
  tuesday: { open: 8, close: 22 },
  wednesday: { open: 8, close: 22 },
  thursday: { open: 8, close: 22 },
  friday: { open: 8, close: 22 },
  saturday: { open: 8, close: 21 },
  sunday: { open: 8, close: 18 },
};

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// Return the available hourly booking slots for a date
export function getAvailableHours(dateString) {
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    return [];
  }

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  // Reject invalid calendar dates
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return [];
  }

  const dayName = DAYS[date.getUTCDay()];
  const hours = OPENING_HOURS[dayName];

  if (!hours) {
    return [];
  }

  return Array.from(
    { length: hours.close - hours.open },
    (_, index) =>
      `${String(hours.open + index).padStart(2, "0")}:00`
  );
}

// Check whether a selected time is within opening hours
export function isWithinOpeningHours(dateString, hourString) {
  if (
    typeof hourString !== "string" ||
    !/^\d{2}:00$/.test(hourString)
  ) {
    return false;
  }

  return getAvailableHours(dateString).includes(hourString);
}


export function getBookableHours(dateString) {
  const availableHours = getAvailableHours(dateString);

  // Get the current date and hour in London
  const now = new Date();

  const londonDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const dateParts = Object.fromEntries(
    londonDate.map(({ type, value }) => [type, value])
  );

  const today = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;

  const currentHour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now)
  );

  // No bookings on dates in the past
  if (dateString < today) {
    return [];
  }

  // Future dates retain all available opening hours
  if (dateString > today) {
    return availableHours;
  }

  // Today's bookings must start in a future hour
  return availableHours.filter(
    (hour) => Number(hour.slice(0, 2)) > currentHour
  );
}
