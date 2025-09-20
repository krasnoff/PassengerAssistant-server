import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CoreMessage, generateText } from "ai";
import 'dotenv/config';
import { createRouteTool } from "../tools/route.tool";
import { ActionResponse } from "../interfaces/return-action-response.interface";

const google = createGoogleGenerativeAI({
    // custom settings
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

async function returnActionResponse(prompt: ActionResponse): Promise<CoreMessage> {

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
        system: `You are a helpful assistant that helps people find public transport routes in a city. You can use the "route" tool to get the routes by public transport from one location to another.`,
        tools: tools
    });

    if (result.toolResults && result.toolResults.length > 0) {
        // Tool response: map all tool results to CoreToolMessage shape
        const toolMessage: CoreMessage = {
            role: 'tool',
            content: result.toolResults.map((tr: any) => ({
                type: 'tool-result',
                toolCallId: tr.toolCallId,
                toolName: tr.toolName,
                result: tr.result
            }))
        };
        return toolMessage;
    } else {
        // Assistant text response mapped to CoreMessage
        const assistantMessage: CoreMessage = {
            role: 'assistant',
            content: result.text
        } as CoreMessage;
        return assistantMessage;
    }
}

export default {
    returnActionResponse
};