import type { Id } from "@convex/_generated/dataModel";
import { generateText } from "ai";
import { openrouter } from "../../shared/providers";
import type { WorkflowYield } from "../types";
import type { WorkflowResult } from "./types";

export function createWorkflowStream(workflowGenerator: AsyncGenerator<WorkflowYield, WorkflowResult>, prompt: string) {
  const messageId = `msg-${Date.now()}`;

  return new ReadableStream({
    async start(controller) {
      try {
        // Send text-start marker
        controller.enqueue({
          type: "text-start" as const,
          id: messageId,
        });

        // Generate and send prologue
        const prologueText = await generatePrologue(prompt);
        controller.enqueue({
          type: "text-delta" as const,
          id: messageId,
          delta: `${prologueText}\n\n`,
        });

        // Stream workflow chunks
        let capturedProjectId: Id<"projects"> | null = null;
        let capturedProjectName: string | null = null;
        let result: WorkflowYield | null = null;

        try {
          for await (const chunk of workflowGenerator) {
            if (chunk.type === "step") {
              const stepId =
                chunk.stepId ?? `step-${chunk.text?.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() ?? "step"}`;

              controller.enqueue({
                type: "data-step" as const,
                id: stepId,
                data: {
                  stepText: chunk.text ?? "",
                  status: chunk.status || "in-progress",
                  ...(chunk.output !== undefined && { output: chunk.output }),
                  ...(chunk.reasoning !== undefined && { reasoning: chunk.reasoning }),
                },
              });
            } else if (chunk.type === "text") {
              controller.enqueue({
                type: "text-delta" as const,
                id: messageId,
                delta: chunk.text ?? "",
              });
            } else if (chunk.type === "meta") {
              result = chunk;
              if (chunk.projectId) {
                capturedProjectId = chunk.projectId;
              }
              if (chunk.projectName) {
                capturedProjectName = chunk.projectName;
              }

              // Enqueue data-meta immediately when received
              controller.enqueue({
                type: "data-meta" as const,
                data: {
                  ...(chunk.projectId && { projectId: chunk.projectId }),
                  ...(chunk.projectName && { projectName: chunk.projectName }),
                },
              });
            }
          }

          // Get the final result from the generator
          if (result?.projectId) {
            capturedProjectId = result.projectId;
          }
          if (result?.projectName) {
            capturedProjectName = result.projectName;
          }
        } catch (error) {
          console.error("[WorkflowStream] Error in workflow:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue({
            type: "text-delta" as const,
            id: messageId,
            delta: `\nError: ${errorMessage}\n`,
          });
        }

        // Generate outro
        const outroText = await generateOutro();
        controller.enqueue({
          type: "text-delta" as const,
          id: messageId,
          delta: `${outroText}\n\n`,
        });

        // Send text-end marker
        controller.enqueue({
          type: "text-end" as const,
          id: messageId,
        });

        if (capturedProjectId || capturedProjectName) {
          controller.enqueue({
            type: "data-meta" as const,
            data: {
              ...(capturedProjectId && { projectId: capturedProjectId }),
              ...(capturedProjectName && { projectName: capturedProjectName }),
            },
          });
        }

        controller.close();
      } catch (error) {
        console.error("[WorkflowStream] Critical error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        controller.enqueue({
          type: "text-delta" as const,
          id: messageId,
          delta: `\nCritical Error: ${errorMessage}\n`,
        });
        controller.enqueue({
          type: "text-end" as const,
          id: messageId,
        });
        controller.close();
      }
    },
  });
}

async function generatePrologue(prompt: string): Promise<string> {
  try {
    const prologueGeneration = await generateText({
      model: openrouter.chat("google/gemini-3-flash-preview"),
      prompt: `Based on this project request: "${prompt}"

Generate a brief 1-2 sentence response that:
1. Shows understanding of what the user wants to build
2. Ends with "Now I will start with the implementation."

Keep it friendly, concise, and professional.`,
    });

    return prologueGeneration.text.trim();
  } catch (error) {
    console.error("[WorkflowStream] Error generating prologue:", error);
    return "I understand your request. Now I will start with the implementation.";
  }
}

async function generateOutro(): Promise<string> {
  try {
    const outroGeneration = await generateText({
      model: openrouter.chat("google/gemini-3-flash-preview"),
      prompt: `Generate a brief 1-2 sentence outro message that:
1. Congratulates the user on the completed project
2. Encourages them to explore and customize it
3. Keeps it friendly and enthusiastic

Keep it concise and professional.`,
    });

    return outroGeneration.text.trim();
  } catch (error) {
    console.error("[WorkflowStream] Error generating outro:", error);
    return "Your project has been created successfully! Feel free to explore and customize it.";
  }
}
