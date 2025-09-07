import { tool } from 'ai';
import { z } from 'zod';


export const routeTool = tool({
    name: "routeTool", // required by createTool
    description: 'get the route between two locations',
    inputSchema: z.object({
        fromLocation: z.string().describe('The location to get the route from'),
        toLocation: z.string().describe('The location to get the route to'),
    }),
    execute: async ({ fromLocation, toLocation }: { fromLocation: string; toLocation: string }) => {
        return {
            fromLocation,
            toLocation,
        };
    },
});
