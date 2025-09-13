import { formatInTimeZone } from 'date-fns-tz';
import { parseNaturalWhenToDate } from '../tools/time.tool';

const TZ = 'America/New_York';

function demo(label: string, expr: string) {
  const base = new Date('2025-09-13T12:00:00Z'); // fixed base for reproducibility
  const dt = parseNaturalWhenToDate(expr, base, TZ);
  console.log(`${label.padEnd(20)} -> ${expr.padEnd(22)} => UTC: ${dt.toISOString()} | NY: ${formatInTimeZone(dt, TZ, "yyyy-MM-dd'T'HH:mmXXX zzz")}`);
}

function main() {
  console.log('Base (UTC): 2025-09-13T12:00:00Z');
  demo('now', 'now');
  demo('today morning', 'today morning');
  demo('tomorrow afternoon', 'tomorrow afternoon');
  demo('monday morning', 'monday morning');
  demo('friday evening', 'friday evening');
  demo('next week', 'next week');
  demo('text week', 'text week');
  demo('morning (alone)', 'morning');
}

main();
