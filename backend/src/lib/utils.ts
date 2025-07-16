import { format } from "date-fns";

export interface ClassInstanceData {
  date: Date;
}

/**
 * Generate class instances for each day between start and end dates
 * Creates one instance per day in the date range (inclusive)
 * Example: Dec 1-3 creates instances for Dec 1, Dec 2, Dec 3
 */
export function generateClassInstances(
  startDate: Date,
  endDate: Date
): ClassInstanceData[] {
  const instances: ClassInstanceData[] = [];

  // Create a copy of the start date to avoid modifying the original
  const currentDate = new Date(startDate.getTime());

  // Generate instances for each day in the range
  while (currentDate <= endDate) {
    instances.push({
      date: new Date(currentDate.getTime()), // Create a copy
    });

    // Move to the next day (24 hours in milliseconds)
    currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return instances;
}

// Format date for consistent API responses
export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDate(dateString: string): Date {
  // Split the date string to get year, month, day
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Check if a date is the same day as another date (comparing UTC dates)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}
