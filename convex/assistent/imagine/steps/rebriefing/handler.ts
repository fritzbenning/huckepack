import { briefingAgent } from "../../../agents/briefingAgent";
import type { RebriefingInput, WorkflowYield } from "../../types";
import { createErrorMessage } from "../../utils/errorHandlers";
import type { Rebriefing } from "./schema";

export async function* executeRebriefing(input: RebriefingInput): AsyncGenerator<WorkflowYield, Rebriefing> {
  const stepId = "rebriefing";

  const stepTitle = {
    inProgress: "Creating rebriefing...",
    complete: "Rebriefing is ready",
  };

  yield {
    type: "step",
    text: stepTitle.inProgress,
    stepId,
    status: "in-progress",
    output: "",
  };

  try {
    const stream = briefingAgent(input.prompt);
    let previousBriefing = "";

    for await (const partialObject of stream.partialObjectStream) {
      const currentBriefing = partialObject.briefing ?? "";

      if (currentBriefing.length > previousBriefing.length) {
        const newText = currentBriefing.slice(previousBriefing.length);
        if (newText) {
          yield {
            type: "step",
            text: stepTitle.inProgress,
            stepId,
            status: "in-progress",
            output: currentBriefing,
          };
        }
        previousBriefing = currentBriefing;
      }
    }

    const finalObject = await stream.object;

    yield {
      type: "step",
      text: stepTitle.complete,
      stepId,
      status: "completed",
      output: finalObject.briefing,
    };

    return finalObject;
  } catch (error) {
    throw new Error(createErrorMessage("create design briefing", error));
  }
}
