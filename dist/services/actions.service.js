"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_1 = require("@ai-sdk/google");
const ai_1 = require("ai");
require("dotenv/config");
const route_tool_1 = require("../tools/route.tool");
const google = (0, google_1.createGoogleGenerativeAI)({
    // custom settings
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});
async function returnActionResponse(prompt) {
    const tools = {
        route: (0, route_tool_1.createRouteTool)(prompt.args)
    };
    const result = await (0, ai_1.generateText)({
        model: google('gemini-2.5-flash'),
        messages: prompt.messages.map((msg) => {
            // Map your Message to CoreMessage structure
            if (msg.role === 'user' || msg.role === 'assistant' || msg.role === 'tool') {
                // Remove 'id' if present and ensure only allowed properties
                const { id, ...rest } = msg;
                return rest;
            }
            throw new Error(`Invalid message role: ${msg.role}`);
        }),
        system: `You are a helpful assistant that helps people find public transport routes in a city. You can use the "route" tool to get the routes by public transport from one location to another.`,
        tools: tools,
        // Force tool usage when no starting point is provided
        toolChoice: !prompt.args?.startingPoint && prompt.args?.destination ? 'required' : 'auto'
    });
    if (result.toolResults && result.toolResults.length > 0) {
        // Tool response: map all tool results to CoreToolMessage shape
        const toolMessage = {
            role: 'tool',
            content: result.toolResults.map((tr) => ({
                type: 'tool-result',
                toolCallId: tr.toolCallId,
                toolName: tr.toolName,
                result: tr.result
            }))
        };
        return toolMessage;
    }
    else {
        // Assistant text response mapped to CoreMessage
        const assistantMessage = {
            role: 'assistant',
            content: result.text
        };
        return assistantMessage;
    }
}
exports.default = {
    returnActionResponse
};
