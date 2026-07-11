import { api } from "@convex/_generated/api";
import { codeAgent } from "../../../agents/codeAgent";
import { filePlannerAgent } from "../../../agents/filePlannerAgent";
import { toTitleCase } from "../../../utils/toTitleCase";
import type { FilesInput, WorkflowContext, WorkflowYield } from "../../types";
import { createErrorMessage } from "../../utils/errorHandlers";
import { cleanCodeContent } from "./stream";

export async function* executeFiles(context: WorkflowContext, input: FilesInput): AsyncGenerator<WorkflowYield, void> {
  // Get available component names for imports (components created so far)
  const getAvailableComponents = (currentIndex: number) => {
    return input.orderedFiles
      .slice(0, currentIndex)
      .filter((f) => !f.isPage)
      .map((f) => {
        const fileName = f.name.endsWith(".tsx") ? f.name.replace(".tsx", "") : f.name;
        return fileName;
      });
  };

  for (let i = 0; i < input.orderedFiles.length; i++) {
    const file = input.orderedFiles[i];
    const fileName = file.name.endsWith(".tsx") ? file.name : `${file.name}.tsx`;
    const nameWithoutExt = fileName.replace(/\.tsx?$/, "");
    const displayName = toTitleCase(nameWithoutExt);
    const stepId = `files-${fileName}`;

    try {
      // Step 1: Creating concept for file
      yield {
        type: "step",
        text: `Creating concept for ${displayName}...`,
        stepId,
        status: "in-progress",
        output: "",
        reasoning: "",
      };

      let componentReasoning: string | null = null;
      try {
        const reasoningResult = await filePlannerAgent(
          file.name,
          file.purpose,
          file.isPage,
          file.dependencies,
          input.briefing
        );
        componentReasoning = reasoningResult.object.reasoning;
      } catch (error) {
        console.error(`Error generating reasoning for ${fileName}:`, error);
        // Continue even if reasoning fails
      }

      yield {
        type: "step",
        text: `Creating concept for ${displayName}...`,
        stepId,
        status: "completed",
        output: "",
        reasoning: componentReasoning || "",
      };

      // Step 2: Creating code for file
      yield {
        type: "step",
        text: `Creating code for ${displayName}...`,
        stepId,
        status: "in-progress",
        output: "",
        reasoning: componentReasoning || "",
      };

      // Generate code with streaming
      const availableComponents = getAvailableComponents(i);
      const stream = codeAgent(
        file.name,
        file.purpose,
        file.isPage,
        file.dependencies,
        availableComponents,
        input.briefing,
        componentReasoning || undefined
      );

      let codeContent = "";
      let previousOutputLength = 0;
      const extension = fileName.match(/\.(tsx?)$/)?.[1] || "tsx";
      const language = extension === "tsx" ? "tsx" : "ts";

      for await (const chunk of stream.textStream) {
        codeContent += chunk;
        const trimmedContent = codeContent.trim();

        if (trimmedContent.length > previousOutputLength) {
          const currentOutput = `\`\`\`${language}\n${trimmedContent}\n\`\`\``;
          yield {
            type: "step",
            text: `Creating code for ${displayName}...`,
            stepId,
            status: "in-progress",
            output: currentOutput,
            reasoning: componentReasoning || "",
          };
          previousOutputLength = trimmedContent.length;
        }
      }

      // Get final text and clean it
      const finalText = await stream.text;
      const finalCodeContent = cleanCodeContent(finalText);

      // Create file in Convex
      await context.ctx.runMutation(api.files.create, {
        projectId: input.projectId,
        name: nameWithoutExt,
        type: file.isPage ? "page" : "component",
        extension: extension,
        code: finalCodeContent,
      });

      // Step 3: File created
      yield {
        type: "step",
        text: `${displayName} created`,
        stepId,
        status: "completed",
        output: `\`\`\`${language}\n${finalCodeContent}\n\`\`\``,
        reasoning: componentReasoning || "",
      };
    } catch (error) {
      throw new Error(createErrorMessage(`create file ${fileName}`, error));
    }
  }
}
