import { tool } from "ai";
import z from "zod";
import type { RouteRequest } from "../services/route.service";
import { returnRouteResponse } from "../services/route.service";

export const routeTool = tool({
    description: `
        Get the routes by public transport from one location to another.
        if the source is not specified then use coordinates`,
    parameters: z.object({
        fromLocation: z
            .object({
                address: z.string().min(1).optional(),
                coordinates: z
                    .object({ lat: z.number(), lng: z.number() })
                    .optional()
            })
            .describe('Passenger starting point'),
        toLocation: z
            .string()
            .describe('Passenger destination point'),
        when: z
            .string()
            .optional()
            .describe('When to depart: "now" (default) or "monday-9am-ny"'),
    }),
    execute: async ({ fromLocation, toLocation, when }) => {
        // Basic logging without object coercion noise
        const fromLog = fromLocation?.address
            ? `address: ${fromLocation.address}`
            : fromLocation?.coordinates
                ? `coords: (${fromLocation.coordinates.lat}, ${fromLocation.coordinates.lng})`
                : 'unspecified';
        console.log(`Getting routes from ${fromLog} to address: ${toLocation}`);

        // Resolve departure time
        const departureISO = when && when.toLowerCase() !== 'now'
            ? when
            : new Date().toISOString();

        // Default to NYC if nothing provided
        const defaultCoords = { lat: 40.712776, lng: -74.005974 } as const;

        const origin = fromLocation?.address
            ? { address: fromLocation.address }
            : fromLocation?.coordinates
                ? { coordinates: fromLocation.coordinates }
                : { coordinates: defaultCoords };

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

        try {
            const response = await returnRouteResponse(routeRequest);
            console.log('Route response received.');
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
