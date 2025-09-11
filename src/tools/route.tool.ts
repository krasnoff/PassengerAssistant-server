import { tool } from "ai";
import z from "zod";

export const routeTool = tool({
    description: 'Get the routes by public transport from one location to another',
    parameters: z.object({
        fromLocation: z
            .string()
            .describe('Passenger starting point'),
        toLocation: z
            .string()
            .describe('Passenger destination point'),
    }),
    execute: async ({ fromLocation, toLocation }) => {
        console.log(`Getting routes from ${fromLocation} to ${toLocation}`);
        return {
            fromLocation,
            toLocation,
            route: "Take the bus from " + fromLocation + " to " + toLocation
        };
    },
})