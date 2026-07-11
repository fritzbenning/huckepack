import { streamText } from "ai";
import { openrouter } from "../shared/providers";

export function codeAgent(
  name: string,
  purpose: string,
  isPage: boolean,
  dependencies: string[],
  availableComponents: string[],
  designBriefing?: string,
  componentReasoning?: string
) {
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

  const designContext = designBriefing ? `\n\nDesign Briefing:\n${designBriefing}\n\n` : "";
  const reasoningContext = componentReasoning ? `\n\nComponent Design Reasoning:\n${componentReasoning}\n\n` : "";

  const codePrompt = isPage
    ? `Create a React 19 component for a page called "${name}" with purpose: ${purpose}.

${baseRequirements}

${dependencies.length > 0 ? `This page should use these components: ${dependencies.join(", ")}. Available components: ${availableComponents.join(", ")}.` : ""}

${designContext}${reasoningContext}${baseImportant}

Generate complete, production-ready code following the strict code style rules. Apply the design briefing and component reasoning to create a visually cohesive and well-designed component.`
    : `Create a React 19 reusable component called "${name}" with purpose: ${purpose}.

${baseRequirements}
- Make it reusable with props

${dependencies.length > 0 ? `This component may use these other components: ${dependencies.join(", ")}. Available components: ${availableComponents.join(", ")}.` : ""}

${designContext}${reasoningContext}${baseImportant}

Generate complete, production-ready code following the strict code style rules. Apply the design briefing and component reasoning to create a visually cohesive and well-designed component.`;

  return streamText({
    model: openrouter.chat("google/gemini-3-flash-preview"),
    prompt: codePrompt,
  });
}
