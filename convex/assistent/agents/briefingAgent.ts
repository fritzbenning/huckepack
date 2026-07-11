import { streamObject } from "ai";
import { rebriefingSchema } from "../imagine/steps/rebriefing/schema";
import { openrouter } from "../shared/providers";

export function briefingAgent(prompt: string) {
  return streamObject({
    model: openrouter.chat("google/gemini-3-flash-preview"),
    schema: rebriefingSchema,
    prompt: `Based on this project request, create a comprehensive rebriefing that will guide the implementation:

            "This is the project request: ${prompt}"

            The rebriefing should include:
            - Polished summary of the project request
            - OPTIONAL: Description of the target audience
            - Requirements that needs to be fullfilled to meet the request
            - Describe the design language and principlies that fits the request

            Try to gather all these informations from the project request first and only add additional information if needed.

            Make it detailed and actionable so it can be used as instruction for all subsequent design and implementation steps.
            
            IMPORTANT: Format the message in markdown, but only use text paragraphs, bold and lists, no other formatting.`,
  });
}
