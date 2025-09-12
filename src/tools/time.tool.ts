import { addDays } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const NY_TZ = 'America/New_York';

/**
 * Returns a Date representing the next occurrence of Monday 9:00 AM in New York time.
 * If the base time is before Monday 9:00 AM NY time this week, returns that time; otherwise, the following Monday.
 * The returned Date is in UTC (JavaScript Date instance with UTC clock), safe for APIs that expect ISO UTC strings.
 */
export function getNextMondayAtNineInNY(baseDate: Date = new Date()): Date {
  // Represent the base date/time in New York's local calendar
  const baseInNY = toZonedTime(baseDate, NY_TZ);

  const day = baseInNY.getDay(); // 0=Sun,1=Mon,...
  const hours = baseInNY.getHours();
  const minutes = baseInNY.getMinutes();
  const seconds = baseInNY.getSeconds();
  const ms = baseInNY.getMilliseconds();

  // How many days to add to reach Monday
  const toMonday = (1 - day + 7) % 7; // 0 if Monday

  // Determine the local NY date components for the target Monday
  const baseYear = baseInNY.getFullYear();
  const baseMonth = baseInNY.getMonth();
  const baseDateNum = baseInNY.getDate();

  // If it's Monday but after 09:00, schedule next week's Monday
  const addDaysCount = toMonday === 0
    ? (hours > 9 || (hours === 9 && (minutes > 0 || seconds > 0 || ms > 0)) ? 7 : 0)
    : toMonday;

  // Build a naive local Date representing NY calendar date at 09:00
  const localTarget = new Date(baseYear, baseMonth, baseDateNum + addDaysCount, 9, 0, 0, 0);

  // Convert that NY-local time to the actual UTC instant
  const candidateUTC = fromZonedTime(localTarget, NY_TZ);
  
  // Safety: ensure result is not earlier than the current moment in NY; if so, add 7 days
  const candidateInNY = toZonedTime(candidateUTC, NY_TZ);
  if (candidateInNY <= baseInNY) {
    const bumpedLocal = new Date(localTarget);
    bumpedLocal.setDate(bumpedLocal.getDate() + 7);
    return fromZonedTime(bumpedLocal, NY_TZ);
  }

  return candidateUTC;
}

/** Format helper for logging */
export function formatAsISO(date: Date): string {
  return date.toISOString();
}

export default {
  getNextMondayAtNineInNY,
  formatAsISO,
};
