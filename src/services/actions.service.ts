import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, ModelMessage } from "ai";
import 'dotenv/config';

const google = createGoogleGenerativeAI({
    // custom settings
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

async function returnActionResponse(prompt: ModelMessage[]): Promise<ModelMessage> {
    const result = await generateText({
        model: google('gemini-2.5-flash'),
        messages: prompt,
    });

    return { role: 'assistant', content: result.text };
}

export default {
    returnActionResponse
};