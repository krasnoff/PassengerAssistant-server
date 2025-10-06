"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNaturalWhenToDate = parseNaturalWhenToDate;
exports.parseNaturalWhenToISO = parseNaturalWhenToISO;
const date_fns_tz_1 = require("date-fns-tz");
const NY_TZ = 'America/New_York';
/**
 * Parse simple natural language expressions like:
 * - "now"
 * - "today morning|afternoon|evening|night|noon|midnight|tonight"
 * - "tomorrow [period]"
 * - "<weekday> [period]" (e.g., "monday morning")
 * - "next week" or common typo "text week" (maps to next Monday 09:00)
 * Returns a Date (UTC instant) representing the intended local time in the given timezone.
 * Falls back to the base date if it cannot parse.
 */
function parseNaturalWhenToDate(whenInput, baseDate = new Date(), tz = NY_TZ) {
    if (!whenInput || !whenInput.trim())
        return baseDate;
    const normalized = whenInput.trim().toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/text week/g, 'next week'); // common typo handling
    if (normalized === 'now')
        return baseDate;
    const PERIODS = {
        morning: 9, // 09:00
        afternoon: 15, // 15:00
        evening: 19, // 19:00
        night: 22, // 22:00
        noon: 12,
        midnight: 0,
    };
    const WEEKDAYS = {
        sunday: 0, sun: 0,
        monday: 1, mon: 1,
        tuesday: 2, tue: 2, tues: 2,
        wednesday: 3, wed: 3,
        thursday: 4, thu: 4, thurs: 4,
        friday: 5, fri: 5,
        saturday: 6, sat: 6,
    };
    const baseInTZ = (0, date_fns_tz_1.toZonedTime)(baseDate, tz);
    const has = (word) => normalized.includes(word);
    const pickHour = () => {
        for (const key of Object.keys(PERIODS)) {
            if (has(key))
                return PERIODS[key];
        }
        // default time-of-day when unspecified
        return 9; // 09:00 local
    };
    const buildLocal = (y, m, d, h) => new Date(y, m, d, h, 0, 0, 0);
    // today/tonight
    if (has('today') || has('tonight')) {
        const hour = has('tonight') ? 19 : pickHour();
        const local = buildLocal(baseInTZ.getFullYear(), baseInTZ.getMonth(), baseInTZ.getDate(), hour);
        const utc = (0, date_fns_tz_1.fromZonedTime)(local, tz);
        // ensure not in the past vs base; if past, bump to tomorrow same hour
        if ((0, date_fns_tz_1.toZonedTime)(utc, tz) <= baseInTZ) {
            const bump = new Date(local);
            bump.setDate(bump.getDate() + 1);
            return (0, date_fns_tz_1.fromZonedTime)(bump, tz);
        }
        return utc;
    }
    // tomorrow
    if (has('tomorrow')) {
        const hour = pickHour();
        const local = buildLocal(baseInTZ.getFullYear(), baseInTZ.getMonth(), baseInTZ.getDate() + 1, hour);
        return (0, date_fns_tz_1.fromZonedTime)(local, tz);
    }
    // next week
    if (has('next week')) {
        // Next week's Monday at chosen hour
        const hour = pickHour();
        // Find upcoming Monday first, then add 7 days to ensure next week (even if today < Monday)
        const day = baseInTZ.getDay();
        const toMon = (1 - day + 7) % 7;
        const nextMonLocal = buildLocal(baseInTZ.getFullYear(), baseInTZ.getMonth(), baseInTZ.getDate() + toMon + 7, hour);
        return (0, date_fns_tz_1.fromZonedTime)(nextMonLocal, tz);
    }
    // specific weekday
    for (const key of Object.keys(WEEKDAYS)) {
        if (normalized.startsWith(key)) {
            const targetDow = WEEKDAYS[key];
            const hour = pickHour();
            const day = baseInTZ.getDay();
            let add = (targetDow - day + 7) % 7; // 0..6
            // If same day and time already passed, move to next week
            const tentativeLocal = buildLocal(baseInTZ.getFullYear(), baseInTZ.getMonth(), baseInTZ.getDate() + add, hour);
            let utc = (0, date_fns_tz_1.fromZonedTime)(tentativeLocal, tz);
            if ((0, date_fns_tz_1.toZonedTime)(utc, tz) <= baseInTZ) {
                const bump = new Date(tentativeLocal);
                bump.setDate(bump.getDate() + 7);
                utc = (0, date_fns_tz_1.fromZonedTime)(bump, tz);
            }
            return utc;
        }
    }
    // Fallback: if we see only a period word like "morning" with no day, assume next occurrence today/tomorrow
    for (const period of Object.keys(PERIODS)) {
        if (has(period)) {
            const hour = PERIODS[period];
            const tentativeLocal = buildLocal(baseInTZ.getFullYear(), baseInTZ.getMonth(), baseInTZ.getDate(), hour);
            let utc = (0, date_fns_tz_1.fromZonedTime)(tentativeLocal, tz);
            if ((0, date_fns_tz_1.toZonedTime)(utc, tz) <= baseInTZ) {
                const bump = new Date(tentativeLocal);
                bump.setDate(bump.getDate() + 1);
                utc = (0, date_fns_tz_1.fromZonedTime)(bump, tz);
            }
            return utc;
        }
    }
    // Unknown: return base date (acts like now)
    return baseDate;
}
/** Convenience wrapper: returns ISO string */
function parseNaturalWhenToISO(whenInput, baseDate = new Date(), tz = NY_TZ) {
    return parseNaturalWhenToDate(whenInput, baseDate, tz).toISOString();
}
exports.default = {
    parseNaturalWhenToDate,
    parseNaturalWhenToISO,
};
