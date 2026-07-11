import { generateObject } from "ai";
import { z } from "zod";
import { openrouter } from "../shared/providers";

const componentReasoningSchema = z.object({
  reasoning: z
    .string()
    .describe(
      "Detailed reasoning about how this component should be designed, including its visual appearance, styling approach, layout structure, interaction patterns, and how it fits into the overall design system"
    ),
});

export async function filePlannerAgent(
  name: string,
  purpose: string,
  isPage: boolean,
  dependencies: string[],
  designBriefing?: string
) {
  return generateObject({
    model: openrouter.chat("google/gemini-3-flash-preview"),
    schema: componentReasoningSchema,
    prompt: `Reason about how the ${isPage ? "page" : "component"} "${name}" should be designed and look like.

Component/Page Purpose: ${purpose}
${dependencies.length > 0 ? `Dependencies: ${dependencies.join(", ")}` : ""}

${designBriefing ? `Design Briefing:\n${designBriefing}\n\n` : ""}

Provide detailed reasoning about:
- Visual appearance and styling approach
- Layout structure and component organization
- Color scheme and typography to use
- Spacing, sizing, and proportions
- Interaction patterns and user experience considerations
- How it fits into the overall design system
- Specific design decisions and their rationale

Make it comprehensive and actionable for implementation.`,
  });
}
