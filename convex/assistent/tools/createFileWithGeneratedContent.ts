import { api } from "@convex/_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { tool } from "ai";
import { z } from "zod";
import { ErrorMessages } from "./errorMessages";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export function createFileWithGeneratedContentTool(
  ctx: ActionCtx,
  projectId: Id<"projects">,
  userId: Id<"users">,
  availableComponents: string[],
  designBriefing?: string | null,
  componentReasoning?: string | null
) {
  return tool({
    description: "Create a new file with AI-generated content in the current project",
    inputSchema: z.object({
      name: z.string().describe("File name (with or without extension, e.g., 'Button.tsx' or 'Button')"),
      purpose: z.string().describe("What this file/component does"),
      isPage: z.boolean().describe("Whether this is a page component (true) or a regular component (false)"),
      dependencies: z.array(z.string()).default([]).describe("Other components this depends on"),
    }),
    execute: async (params) => {
      try {
        if (!userId) {
          return ErrorMessages.userIdRequired();
        }

        const nameWithoutExt = params.name.replace(/\.(tsx?|jsx?)$/, "");
        const extension = params.name.match(/\.(tsx?|jsx?)$/)?.[1] || "tsx";

        const baseRequirements = `Requirements:
- Use React 19
- Use Tailwind 4 classes directly in className (no abstractions like clsx, cn, cva)
- Use template literals for conditional classes (not nested): className={\`base-class \${condition ? 'active' : 'inactive'}\`}
- Include TypeScript interface for props inline (do not extract types)
- Use default export
- Keep it simple and focused`;

        const baseImportant = `IMPORTANT: 
- Return ONLY the code, without markdown code blocks (no \`\`\`tsx or \`\`\` markers). Return pure TypeScript/React code.
- When importing dependencies, use the EXACT component name from the available components list with format: import ComponentName from './ComponentName';
- Provide for each component property a default value`;

        const designContext = designBriefing
          ? `\n\nDesign Briefing:\n${designBriefing}\n\n`
          : "";

        const reasoningContext = componentReasoning
          ? `\n\nComponent Design Reasoning:\n${componentReasoning}\n\n`
          : "";

        const codePrompt = params.isPage
          ? `Create a React 19 component for a page called "${nameWithoutExt}" with purpose: ${params.purpose}.

${baseRequirements}

${params.dependencies.length > 0 ? `This page should use these components: ${params.dependencies.join(", ")}. Available components: ${availableComponents.join(", ")}.` : ""}

${designContext}${reasoningContext}${baseImportant}

Generate complete, production-ready code following the strict code style rules. Apply the design briefing and component reasoning to create a visually cohesive and well-designed component.`
          : `Create a React 19 reusable component called "${nameWithoutExt}" with purpose: ${params.purpose}.

${baseRequirements}
- Make it reusable with props

${params.dependencies.length > 0 ? `This component may use these other components: ${params.dependencies.join(", ")}. Available components: ${availableComponents.join(", ")}.` : ""}

${designContext}${reasoningContext}${baseImportant}

Generate complete, production-ready code following the strict code style rules. Apply the design briefing and component reasoning to create a visually cohesive and well-designed component.`;

        const codeGeneration = await generateText({
          model: openrouter.chat("google/gemini-3-flash-preview"),
          prompt: codePrompt,
        });

        let codeContent = codeGeneration.text.trim();
        if (codeContent.startsWith("```")) {
          const lines = codeContent.split("\n");
          if (lines[0].match(/^```(tsx?|jsx?)?$/)) {
            lines.shift();
          }
          if (lines.length > 0 && lines[lines.length - 1].trim() === "```") {
            lines.pop();
          }
          codeContent = lines.join("\n").trim();
        }

        const fileId = await ctx.runMutation(api.files.create, {
          projectId,
          name: nameWithoutExt,
          type: params.isPage ? "page" : "component",
          extension: extension,
          code: codeContent,
        });

        return JSON.stringify({
          success: true,
          fileId,
          message: `File "${params.name}" created successfully with generated content`,
        });
      } catch (error) {
        return ErrorMessages.genericError("creating file with generated content", error);
      }
    },
  });
}

