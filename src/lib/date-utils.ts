import { eachDayOfInterval, isWeekend } from "date-fns";

/**
 * Calculate the number of business days (weekdays only, excluding weekends)
 * between two dates, inclusive.
 *
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Number of weekdays between the dates (inclusive)
 */
export function countBusinessDays(startDate: Date, endDate: Date): number {
  if (endDate <= startDate) {
    return 0;
  }

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return days.filter((day) => !isWeekend(day)).length;
}

/**
 * Format time as HH:MM string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
