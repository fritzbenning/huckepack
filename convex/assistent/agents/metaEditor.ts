import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Experimental_Agent as Agent, stepCountIs } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const metaEditorModel = openrouter.chat("mistralai/mistral-small-3.1-24b-instruct:free");
// export const metaEditorModel = openrouter.chat("amazon/nova-2-lite-v1:free");
// export const metaEditorModel = openrouter.chat("google/gemini-2.5-flash-lite");

export const metaEditor = new Agent({
  model: metaEditorModel,
  system:
    "You are the meta editor agent responsible for managing thread metadata like titles and summaries. NEVER expose IDs.",
  tools: {},
  stopWhen: stepCountIs(10),
});
