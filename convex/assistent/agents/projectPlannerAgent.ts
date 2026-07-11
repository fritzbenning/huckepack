import { streamObject } from "ai";
import { architectureSchema } from "../imagine/steps/architecture/schema";
import { openrouter } from "../shared/providers";

export function projectPlannerAgent(prompt: string, designBriefing?: string) {
  return streamObject({
    model: openrouter.chat("google/gemini-3-flash-preview"),
    schema: architectureSchema,
    prompt: `Analyze this project request and determine what components and pages are needed:

            "${prompt}"

            ${designBriefing ? `Design Briefing:\n${designBriefing}\n\n` : ""}

            Rules:
            - components: Array of reusable UI components (e.g., Button, Card, Header)
            - pages: Array of full page components (e.g., HomePage, AboutPage)
            - dependencies: Array of strings listing component/page names this depends on (can be empty array [])
            - Component names should be PascalCase
            - Page names should be PascalCase ending with "Page"
            - Dependencies should reference exact component/page names

            IMPORTANT: Components should be created before pages that use them.`,
  });
}
