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
        tools: {
            weather: tool({
                description: 'Get the weather in a location (fahrenheit)',
                parameters: z.object({
                    location: z
                    .string()
                    .describe('The location to get the weather for'),
                }),
                execute: async ({ location }) => {
                    const temperature = Math.round(Math.random() * (90 - 32) + 32);
                    return {
                    location,
                    temperature,
                    };
                },
            }),
        }
    });

    return { role: 'assistant', content: result.text };
}

export default {
    returnActionResponse
};