"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_tz_1 = require("date-fns-tz");
const time_tool_1 = require("../tools/time.tool");
const TZ = 'America/New_York';
function demo(label, expr) {
    const base = new Date('2025-09-13T12:00:00Z'); // fixed base for reproducibility
    const dt = (0, time_tool_1.parseNaturalWhenToDate)(expr, base, TZ);
    console.log(`${label.padEnd(20)} -> ${expr.padEnd(22)} => UTC: ${dt.toISOString()} | NY: ${(0, date_fns_tz_1.formatInTimeZone)(dt, TZ, "yyyy-MM-dd'T'HH:mmXXX zzz")}`);
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
