"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouteTool = createRouteTool;
const ai_1 = require("ai");
const zod_1 = __importDefault(require("zod"));
const route_service_1 = require("../services/route.service");
const time_tool_1 = require("./time.tool");
function createRouteTool(args) {
    return (0, ai_1.tool)({
        description: `
            Get the routes by public transport from one location to another.
            The starting point (fromLocation) is optional. If it's not provided,
            the tool will use provided coordinates (if available) or fall back to a sensible default.`,
        parameters: zod_1.default.object({
            fromLocation: zod_1.default
                .object({
                address: zod_1.default.string().min(1).optional(),
                coordinates: zod_1.default
                    .object({ lat: zod_1.default.number(), lng: zod_1.default.number() })
                    .optional()
                    .describe('Latitude and Longitude coordinates. if there is no starting point address then use these coordinates'),
            })
                .describe('Passenger starting point')
                .optional(),
            toLocation: zod_1.default
                .string()
                .describe('Passenger destination point'),
            when: zod_1.default
                .string()
                .optional()
                .describe('When to depart: ISO datetime string'),
        }),
        execute: async ({ fromLocation, toLocation, when }) => {
            // Basic logging without object coercion noise
            const fromLog = fromLocation?.address
                ? `address: ${fromLocation.address}`
                : fromLocation?.coordinates
                    ? `coords: (${fromLocation.coordinates.lat}, ${fromLocation.coordinates.lng})`
                    : 'unspecified';
            // console.log(`Getting routes from ${fromLog} to address: ${toLocation}`);
            // Resolve departure time
            // Convert natural language like "monday morning", "tomorrow afternoon", "text week" to ISO
            const departureISO = (0, time_tool_1.parseNaturalWhenToISO)(when, args.currentTime ? new Date(args.currentTime) : new Date());
            // Default to NYC if nothing provided
            const defaultCoords = { lat: 40.712776, lng: -74.005974 };
            const origin = fromLocation?.address
                ? { address: fromLocation.address }
                : fromLocation?.coordinates
                    ? { location: fromLocation.coordinates }
                    : { location: args.coordinates ? args.coordinates : defaultCoords };
            const routeRequest = {
                origin,
                destination: { address: toLocation },
                travelMode: "TRANSIT",
                departureTime: departureISO,
                computeAlternativeRoutes: true,
                transitPreferences: {
                    allowedTravelModes: ["BUS", "RAIL", "SUBWAY", "TRAM", "FERRY"],
                    routingPreference: "FEWER_TRANSFERS"
                }
            };
            // console.log('Route request sent:', routeRequest);
            try {
                const response = await (0, route_service_1.returnRouteResponse)(routeRequest);
                // console.log('Route response received.');
                return {
                    ok: true,
                    request: routeRequest,
                    raw: response,
                };
            }
            catch (error) {
                console.error('Error fetching route:', error);
                return {
                    ok: false,
                    error: error.message,
                };
            }
        },
    });
}
