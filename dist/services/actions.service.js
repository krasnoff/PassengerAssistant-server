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
const tools = {
    route: route_tool_1.routeTool
};
async function returnActionResponse(prompt) {
    const result = await (0, ai_1.generateText)({
        model: google('gemini-2.5-flash'),
        messages: prompt,
        system: 'You are a helpful assistant that helps people find public transport routes in a city. You can use the "route" tool to get the routes by public transport from one location to another.',
        tools: tools
    });
    if (result.toolResults && result.toolResults.length > 0) {
        // The answer is from a tool
        const toolResult = result.toolResults[0];
        return { role: 'tool', name: toolResult.toolName, content: toolResult.result };
    }
    else {
        // The answer is plain text
        return { role: 'assistant', content: result.text };
    }
}
exports.default = {
    returnActionResponse
};
