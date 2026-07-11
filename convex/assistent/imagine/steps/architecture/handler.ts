import { projectPlannerAgent } from "../../../agents/projectPlannerAgent";
import type { ArchitectureInput, WorkflowContext, WorkflowYield } from "../../types";
import { createErrorMessage } from "../../utils/errorHandlers";
import type { Architecture } from "./schema";
import { formatArchitectureOutput } from "./stream";

export async function* executeArchitecture(
  _context: WorkflowContext,
  input: ArchitectureInput
): AsyncGenerator<WorkflowYield, Architecture> {
  const stepId = "architecture";

  const stepTitle = {
    inProgress: "Creating project architecture...",
    complete: "Project architecture is defined",
  };

  yield {
    type: "step",
    text: stepTitle.inProgress,
    stepId,
    status: "in-progress",
    output: "",
  };

  try {
    const stream = projectPlannerAgent(input.prompt, input.briefing);
    let previousOutput = "";

    for await (const partialObject of stream.partialObjectStream) {
      const currentOutput = formatArchitectureOutput(partialObject);

      if (currentOutput.length > previousOutput.length || currentOutput !== previousOutput) {
        yield {
          type: "step",
          text: stepTitle.inProgress,
          stepId,
          status: "in-progress",
          output: currentOutput,
        };
        previousOutput = currentOutput;
      }
    }

    const finalObject = await stream.object;

    yield {
      type: "step",
      text: stepTitle.complete,
      stepId,
      status: "completed",
      output: formatArchitectureOutput(finalObject),
    };

    return finalObject;
  } catch (error) {
    throw new Error(createErrorMessage("analyze project structure", error));
  }
}
