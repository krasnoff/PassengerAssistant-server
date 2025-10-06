"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeTool = void 0;
const ai_1 = require("ai");
const zod_1 = __importDefault(require("zod"));
const route_service_1 = require("../services/route.service");
exports.routeTool = (0, ai_1.tool)({
    description: 'Get the routes by public transport from one location to another',
    parameters: zod_1.default.object({
        fromLocation: zod_1.default
            .string()
            .describe('Passenger starting point'),
        toLocation: zod_1.default
            .string()
            .describe('Passenger destination point'),
    }),
    execute: async ({ fromLocation, toLocation }) => {
        console.log(`Getting routes from ${fromLocation} to ${toLocation}`);
        const routeRequest = {
            origin: { address: fromLocation },
            destination: { address: toLocation },
            travelMode: "TRANSIT",
            departureTime: new Date().toISOString(),
            computeAlternativeRoutes: true,
            transitPreferences: {
                allowedTravelModes: ["BUS", "RAIL", "SUBWAY", "TRAM", "FERRY"],
                routingPreference: "FEWER_TRANSFERS"
            }
        };
        try {
            const response = await (0, route_service_1.returnRouteResponse)(routeRequest);
            console.log('Route response:', response);
        }
        catch (error) {
            console.error('Error fetching route:', error);
        }
        return {
            fromLocation,
            toLocation,
            route: "Take the bus from " + fromLocation + " to " + toLocation
        };
    },
});
