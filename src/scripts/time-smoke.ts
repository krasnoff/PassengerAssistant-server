import { formatInTimeZone } from 'date-fns-tz';
import timeTool from '../tools/time.tool';

function main() {
  const base = new Date();
  const target = timeTool.parseNaturalWhenToDate('next monday 09:00', base, 'America/New_York');
  console.log('Base now (UTC):   ', base.toISOString());
  console.log('Target (UTC):     ', target.toISOString());
  console.log('Target (NY local):', formatInTimeZone(target, 'America/New_York', "yyyy-MM-dd'T'HH:mmXXX zzz"));
}

main();
