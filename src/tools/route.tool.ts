import { tool } from "ai";
import z from "zod";
import type { RouteRequest } from "../services/route.service";
import { returnRouteResponse } from "../services/route.service";
import { parseNaturalWhenToISO } from "./time.tool";
import { ActionResponseArgs } from "../interfaces/return-action-response.interface";

export function createRouteTool(args: ActionResponseArgs) {
    return tool({
        description: `
            Get the routes by public transport from one location to another.
            The starting point (fromLocation) is optional. If it's not provided,
            the tool will use provided coordinates (if available) or fall back to a sensible default.`,
        parameters: z.object({
            fromLocation: z
                .object({
                    address: z.string().min(1).optional(),
                    coordinates: z
                        .object({ lat: z.number(), lng: z.number() })
                        .optional()
                        .describe('Latitude and Longitude coordinates. if there is no starting point address then use these coordinates'),
                })
                .describe('Passenger starting point')
                .optional(),
            toLocation: z
                .string()
                .describe('Passenger destination point'),
            when: z
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
        const departureISO = parseNaturalWhenToISO(when, args.currentTime ? new Date(args.currentTime) : new Date());

        // Default to NYC if nothing provided
        const defaultCoords = { lat: 40.712776, lng: -74.005974 } as const;

        const origin = fromLocation?.address
            ? { address: fromLocation.address }
            : fromLocation?.coordinates
                ? { location: fromLocation.coordinates }
                : { location: args.coordinates ? args.coordinates : defaultCoords };

        const routeRequest: RouteRequest = {
            origin,
            destination: { address: toLocation },
            travelMode: "TRANSIT",
            departureTime: departureISO,
            computeAlternativeRoutes: true,
            transitPreferences: {
                allowedTravelModes: ["BUS", "RAIL", "SUBWAY", "TRAM", "FERRY"],
                routingPreference: "FEWER_TRANSFERS"
            }
        }
        // console.log('Route request sent:', routeRequest);

        try {
            const response = await returnRouteResponse(routeRequest);
            // console.log('Route response received.');
            return {
                ok: true,
                request: routeRequest,
                raw: response,
            };
        } catch (error) {
            console.error('Error fetching route:', error);
            return {
                ok: false,
                error: (error as Error).message,
            };
        }
    },
})
}
