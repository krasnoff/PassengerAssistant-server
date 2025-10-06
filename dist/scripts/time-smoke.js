"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_tz_1 = require("date-fns-tz");
const time_tool_1 = __importDefault(require("../tools/time.tool"));
function main() {
    const base = new Date();
    const target = time_tool_1.default.parseNaturalWhenToDate('next monday 09:00', base, 'America/New_York');
    console.log('Base now (UTC):   ', base.toISOString());
    console.log('Target (UTC):     ', target.toISOString());
    console.log('Target (NY local):', (0, date_fns_tz_1.formatInTimeZone)(target, 'America/New_York', "yyyy-MM-dd'T'HH:mmXXX zzz"));
}
main();
