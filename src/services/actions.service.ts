import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import 'dotenv/config';
import { z } from 'zod';
import * as readline from 'node:readline/promises';

const google = createGoogleGenerativeAI({
    // custom settings
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});



async function returnActionResponse(prompt: any[]): Promise<any> {
    
    const result = await generateText({
        model: google('gemini-2.5-flash'),
        messages: prompt,
        system: 'If the user asks for the weather, use the weather tool to get the weather in a location. Only use the tool if the user asks for the weather. Always answer in a concise manner.',
        tools: {
            weather: tool({
                description: 'Get the weather in a location (fahrenheit)',
                parameters: z.object({
                    location: z
                    .string()
                    .describe('The location to get the weather for'),
                }),
                execute: async ({ location }) => {
                    console.log(`Getting weather for ${location}`);
                    const temperature = Math.round(Math.random() * (90 - 32) + 32);
                    return "The weather in " + location + " is " + temperature + "°F.";
                    // return {
                    // location,
                    // temperature,
                    // };
                },
            }),
        }
    });

    if (result.toolResults && result.toolResults.length > 0) {
        // The answer is from a tool
        const toolResult = result.toolResults[0];
        return { role: 'tool', name: toolResult.toolName, content: toolResult.result };
    } else {
        // The answer is plain text
        return { role: 'assistant', content: result.text };
    }
}

export default {
    returnActionResponse
};