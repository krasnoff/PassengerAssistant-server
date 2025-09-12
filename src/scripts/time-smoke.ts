import { formatInTimeZone } from 'date-fns-tz';
import { getNextMondayAtNineInNY } from '../tools/time.tool';

function main() {
  const base = new Date();
  const target = getNextMondayAtNineInNY(base);
  console.log('Base now (UTC):   ', base.toISOString());
  console.log('Target (UTC):     ', target.toISOString());
  console.log('Target (NY local):', formatInTimeZone(target, 'America/New_York', "yyyy-MM-dd'T'HH:mmXXX zzz"));
}

main();
