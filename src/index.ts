import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, ModelMessage } from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: ModelMessage[] = [];

const google = createGoogleGenerativeAI({
    // custom settings
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      messages,
    });

    process.stdout.write('\nAssistant: ');
    process.stdout.write(result.text);
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: result.text });
  }
}

main().catch(console.error);