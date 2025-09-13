import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import 'dotenv/config';
import { createRouteTool } from "../tools/route.tool";
import { ActionResponse } from "../interfaces/return-action-response.interface";

const google = createGoogleGenerativeAI({
    // custom settings
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

async function returnActionResponse(prompt: ActionResponse): Promise<any> {

    const tools = {
        route: createRouteTool(prompt.args)
    };

    const result = await generateText({
        model: google('gemini-2.5-flash'),
        messages: prompt.messages.map((msg: any) => {
            // Map your Message to CoreMessage structure
            if (msg.role === 'user' || msg.role === 'assistant' || msg.role === 'tool') {
                // Remove 'id' if present and ensure only allowed properties
                const { id, ...rest } = msg;
                return rest;
            }
            throw new Error(`Invalid message role: ${msg.role}`);
        }),
        system: 'You are a helpful assistant that helps people find public transport routes in a city. You can use the "route" tool to get the routes by public transport from one location to another.',
        tools: tools
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