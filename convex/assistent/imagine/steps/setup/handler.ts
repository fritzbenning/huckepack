import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { SetupInput, WorkflowContext, WorkflowYield } from "../../types";
import { createErrorMessage } from "../../utils/errorHandlers";

export async function* executeSetup(
  context: WorkflowContext,
  input: SetupInput
): AsyncGenerator<WorkflowYield, Id<"projects">> {
  const stepId = "setup";

  const stepTitle = {
    inProgress: "Creating project...",
    complete: "Project created successfully",
  };

  yield {
    type: "step",
    text: stepTitle.inProgress,
    stepId,
    status: "in-progress",
    output: "",
  };

  try {
    const projectId = await context.ctx.runMutation(api.projects.create, {
      teamId: input.teamId,
      name: input.projectName,
      description: input.description,
    });

    yield {
      type: "step",
      text: stepTitle.complete,
      stepId,
      status: "completed",
      output: `Project "${input.projectName}" created successfully!`,
    };

    return projectId;
  } catch (error) {
    throw new Error(createErrorMessage("create project", error));
  }
}
