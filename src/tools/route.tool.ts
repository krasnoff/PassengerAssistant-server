import { tool } from "ai";
import z from "zod";
import type { RouteRequest } from "../services/route.service";
import { returnRouteResponse } from "../services/route.service";
import { getNextMondayAtNineInNY } from './time.tool';

export const routeTool = tool({
    description: 'Get the routes by public transport from one location to another',
    parameters: z.object({
        fromLocation: z
            .string()
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
        console.log(`Getting routes from ${fromLocation} to ${toLocation}`);

        let departureISO = '2025-09-15T09:00:00Z'; // new Date().toISOString();
        // if ((when || '').toLowerCase() === 'monday-9am-ny') {
        //     const target = getNextMondayAtNineInNY();
        //     departureISO = target.toISOString();
        //     console.log('Using departureTime (NY Monday 09:00):', departureISO);
        // }

        const routeRequest: RouteRequest = {
            origin: { address: fromLocation },
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
            console.log('Route response:', response);
        } catch (error) {
            console.error('Error fetching route:', error);
        }
        
        return {
            fromLocation,
            toLocation,
            route: "Take the bus from " + fromLocation + " to " + toLocation
        };
    },
})
